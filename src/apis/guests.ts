import type { Guest, RSVPPayload } from "@/types";

import { ClientResponseError } from "pocketbase";
import { pb } from "@/lib/pb";

const COLLECTION = "birth_guests";

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
