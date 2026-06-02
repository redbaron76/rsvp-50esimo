import type { Guest, GuestImportEntry, RSVPPayload } from "@/types";
import { isGuestInvitedBy } from "@/types";

import { ClientResponseError } from "pocketbase";
import { pb } from "@/lib/pb";

const COLLECTION = "birth_guests";

const escapeFilterValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const buildGuestCreatePayload = (entry: GuestImportEntry) => ({
  name: entry.name.trim(),
  by: entry.by,
  isCouple: entry.isCouple,
  confirmed: null,
  couple_member_1: false,
  couple_member_2: false,
  kids_count: 0,
  confirmed_at: null,
});

export const getGuestById = async (id: string): Promise<Guest | null> => {
  try {
    return await pb.collection(COLLECTION).getOne<Guest>(id);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const updateRSVP = async (
  id: string,
  payload: RSVPPayload,
): Promise<Guest> => {
  return pb.collection(COLLECTION).update<Guest>(id, payload);
};

export const getConfirmedGuests = async (): Promise<Guest[]> => {
  return pb
    .collection(COLLECTION)
    .getFullList<Guest>({ filter: "confirmed=true" });
};

export const getAllGuests = async (): Promise<Guest[]> => {
  return pb
    .collection(COLLECTION)
    .getFullList<Guest>({ sort: "-confirmed_at" });
};

export const getGuestByName = async (name: string): Promise<Guest | null> => {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const filter = `name="${escapeFilterValue(trimmed)}"`;
  const result = await pb
    .collection(COLLECTION)
    .getList<Guest>(1, 1, { filter });

  return result.items[0] ?? null;
};

export const createGuest = async (entry: GuestImportEntry): Promise<Guest> => {
  return pb
    .collection(COLLECTION)
    .create<Guest>(buildGuestCreatePayload(entry));
};

export type GuestImportEntryStatus = "created" | "updated" | "skipped" | "invalid";

export const importGuestEntry = async (
  entry: GuestImportEntry,
): Promise<GuestImportEntryStatus> => {
  if (!entry.name?.trim() || typeof entry.isCouple !== "boolean") {
    return "invalid";
  }

  if (!isGuestInvitedBy(entry.by)) {
    return "invalid";
  }

  const existing = await getGuestByName(entry.name);
  if (existing) {
    const updates: Partial<Pick<Guest, "by" | "isCouple">> = {};

    if (existing.by !== entry.by) {
      updates.by = entry.by;
    }
    if (existing.isCouple !== entry.isCouple) {
      updates.isCouple = entry.isCouple;
    }

    if (Object.keys(updates).length === 0) {
      return "skipped";
    }

    await pb.collection(COLLECTION).update<Guest>(existing.id, updates);
    return "updated";
  }

  await createGuest(entry);
  return "created";
};

export const getImportErrorMessage = (error: unknown): string => {
  if (error instanceof ClientResponseError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Errore sconosciuto durante l'importazione.";
};
