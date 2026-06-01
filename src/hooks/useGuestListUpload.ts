import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { importGuestEntry } from "@/apis/guests";
import type { GuestImportEntry, GuestImportResult } from "@/types";

export interface GuestUploadProgress {
  current: number;
  total: number;
  percent: number;
  currentName: string | null;
}

const emptyResult = (): GuestImportResult => ({
  created: 0,
  skipped: 0,
  invalid: 0,
});

const isGuestImportEntry = (value: unknown): value is GuestImportEntry => {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.name === "string" &&
    typeof entry.isCouple === "boolean" &&
    (entry.by === undefined || typeof entry.by === "string")
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
      "Formato non valido. Ogni invitato deve avere name (string) e isCouple (boolean).",
    );
  }
  return parsed;
};

const processGuestEntries = async (
  entries: GuestImportEntry[],
  index: number,
  result: GuestImportResult,
  onProgress: (progress: GuestUploadProgress) => void,
): Promise<GuestImportResult> => {
  if (index >= entries.length) {
    onProgress({
      current: entries.length,
      total: entries.length,
      percent: 100,
      currentName: null,
    });
    return result;
  }

  const entry = entries[index];
  onProgress({
    current: index,
    total: entries.length,
    percent: Math.round((index / entries.length) * 100),
    currentName: entry.name.trim() || null,
  });

  const status = await importGuestEntry(entry);
  const nextResult: GuestImportResult = {
    ...result,
    [status]: result[status] + 1,
  };

  return processGuestEntries(entries, index + 1, nextResult, onProgress);
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
        const result = await processGuestEntries(
          entries,
          0,
          emptyResult(),
          setUploadProgress,
        );
        setUploadResult(result);
        setUploadError(null);
        await queryClient.invalidateQueries({ queryKey: ["admin-guests"] });
      } catch {
        setUploadError("Errore durante l'importazione. Riprova.");
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
