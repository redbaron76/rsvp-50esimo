export const GUEST_INVITED_BY_VALUES = ["Red", "Mari", "Kiki"] as const;

export type GuestInvitedBy = (typeof GUEST_INVITED_BY_VALUES)[number];

export const isGuestInvitedBy = (value: string): value is GuestInvitedBy =>
  GUEST_INVITED_BY_VALUES.includes(value as GuestInvitedBy);

export interface Guest {
  id: string;
  name: string;
  by: GuestInvitedBy | "";
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

export interface GuestImportEntry {
  name: string;
  isCouple: boolean;
  by: GuestInvitedBy;
}

export interface GuestImportResult {
  created: number;
  updated: number;
  skipped: number;
  invalid: number;
  failed: number;
}

export type GuestImportEntryStatus =
  | "created"
  | "updated"
  | "skipped"
  | "invalid";

export interface RSVPPayload {
  confirmed: boolean;
  couple_member_1: boolean;
  couple_member_2: boolean;
  kids_count: number;
  confirmed_at: string;
}

export const hasGuestResponded = (guest: Guest): boolean =>
  guest.confirmed_at !== null && guest.confirmed_at !== "";

export const getGuestStatus = (guest: Guest): GuestStatus => {
  if (!hasGuestResponded(guest)) return "pending";
  return guest.confirmed ? "confirmed" : "declined";
};
