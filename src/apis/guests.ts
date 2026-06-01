import type { Guest, GuestImportEntry, RSVPPayload } from "@/types";

import { ClientResponseError } from "pocketbase";
import { pb } from "@/lib/pb";

const COLLECTION = "birth_guests";

const escapeFilterValue = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const guestCreateDefaults = (
  entry: GuestImportEntry,
): Pick<
  Guest,
  | "name"
  | "isCouple"
  | "confirmed"
  | "couple_member_1"
  | "couple_member_2"
  | "kids_count"
  | "confirmed_at"
> => ({
  name: entry.name.trim(),
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
  try {
    const filter = `name="${escapeFilterValue(name)}"`;
    return await pb.collection(COLLECTION).getFirstListItem<Guest>(filter);
  } catch (error) {
    if (error instanceof ClientResponseError && error.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createGuest = async (entry: GuestImportEntry): Promise<Guest> => {
  return pb.collection(COLLECTION).create<Guest>(guestCreateDefaults(entry));
};

export type GuestImportEntryStatus = "created" | "skipped" | "invalid";

export const importGuestEntry = async (
  entry: GuestImportEntry,
): Promise<GuestImportEntryStatus> => {
  if (!entry.name?.trim() || typeof entry.isCouple !== "boolean") {
    return "invalid";
  }

  const existing = await getGuestByName(entry.name);
  if (existing) {
    return "skipped";
  }

  await createGuest(entry);
  return "created";
};
