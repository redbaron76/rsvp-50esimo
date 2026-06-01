export interface Guest {
  id: string;
  name: string;
  confirmed: boolean | null;
  isCouple: boolean;
  couple_member_1: boolean;
  couple_member_2: boolean;
  kids_count: number;
  confirmed_at: string | null;
  created: string;
  updated: string;
  collectionId: string;
  collectionName: string;
}

export type GuestStatus = "pending" | "confirmed" | "declined";

export interface RSVPPayload {
  confirmed: boolean;
  couple_member_1: boolean;
  couple_member_2: boolean;
  kids_count: number;
  confirmed_at: string;
}

export const getGuestStatus = (guest: Guest): GuestStatus => {
  if (guest.confirmed === null) return "pending";
  return guest.confirmed ? "confirmed" : "declined";
};
