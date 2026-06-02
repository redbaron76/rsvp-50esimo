import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getImportErrorMessage, importGuestEntry } from "@/apis/guests";
import { pb } from "@/lib/pb";
import {
  GUEST_INVITED_BY_VALUES,
  isGuestInvitedBy,
  type GuestImportEntry,
  type GuestImportResult,
} from "@/types";

export interface GuestUploadProgress {
  current: number;
  total: number;
  percent: number;
  currentName: string | null;
}

const emptyResult = (): GuestImportResult => ({
  created: 0,
  updated: 0,
  skipped: 0,
  invalid: 0,
  failed: 0,
});

const isGuestImportEntry = (value: unknown): value is GuestImportEntry => {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === "string" &&
    typeof entry.isCouple === "boolean" &&
    isGuestInvitedBy(entry.by)
  );
};

const parseGuestImportFile = (raw: string): GuestImportEntry[] => {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Il file JSON deve contenere un array di invitati.");
  }
  if (parsed.length === 0) {
    throw new Error("Il file JSON non contiene invitati.");
  }
  if (!parsed.every(isGuestImportEntry)) {
    throw new Error(
      `Formato non valido. Ogni invitato deve avere name (string), isCouple (boolean) e by (${GUEST_INVITED_BY_VALUES.join(", ")}).`,
    );
  }
  return parsed;
};

const processGuestEntries = async (
  entries: GuestImportEntry[],
  onProgress: (progress: GuestUploadProgress) => void,
): Promise<{ result: GuestImportResult; lastError: string | null }> => {
  const result = emptyResult();
  let lastError: string | null = null;

  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index];

    onProgress({
      current: index,
      total: entries.length,
      percent: Math.round((index / entries.length) * 100),
      currentName: entry.name.trim() || null,
    });

    try {
      const status = await importGuestEntry(entry);
      result[status] += 1;
    } catch (error) {
      result.failed += 1;
      lastError = getImportErrorMessage(error);
    }
  }

  onProgress({
    current: entries.length,
    total: entries.length,
    percent: 100,
    currentName: null,
  });

  return { result, lastError };
};

export const useGuestListUpload = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingEntries, setPendingEntries] = useState<GuestImportEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<GuestUploadProgress | null>(
    null,
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<GuestImportResult | null>(
    null,
  );

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      if (!pb.authStore.isValid) {
        setUploadError("Sessione scaduta. Effettua di nuovo il login.");
        return;
      }

      setUploadError(null);
      setUploadResult(null);
      setUploadProgress(null);

      let entries: GuestImportEntry[];
      try {
        const raw = await file.text();
        entries = parseGuestImportFile(raw);
      } catch (error) {
        setPendingEntries([]);
        setUploadError(
          error instanceof Error
            ? error.message
            : "Impossibile leggere il file JSON.",
        );
        return;
      }

      setPendingEntries(entries);
      setIsUploading(true);
      setUploadProgress({
        current: 0,
        total: entries.length,
        percent: 0,
        currentName: entries[0]?.name ?? null,
      });

      try {
        const { result, lastError } = await processGuestEntries(
          entries,
          setUploadProgress,
        );

        setUploadResult(result);

        if (result.failed > 0) {
          setUploadError(
            lastError
              ? `Importazione parziale: ${result.failed} ${result.failed === 1 ? "errore" : "errori"}. Ultimo errore: ${lastError}`
              : `Importazione parziale: ${result.failed} ${result.failed === 1 ? "errore" : "errori"}.`,
          );
        } else {
          setUploadError(null);
        }

        if (result.created > 0 || result.updated > 0) {
          await queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
        }
      } catch (error) {
        setUploadError(getImportErrorMessage(error));
        setUploadResult(null);
      } finally {
        setIsUploading(false);
        setPendingEntries([]);
      }
    },
    [queryClient],
  );

  return {
    fileInputRef,
    pendingEntries,
    isUploading,
    uploadProgress,
    uploadError,
    uploadResult,
    handleUploadClick,
    handleFileChange,
  };
};
