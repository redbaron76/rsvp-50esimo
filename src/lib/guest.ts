import type { Guest } from "@/types";

const COUPLE_NAME_SEPARATOR = /\s+e\s+/i;

/** Estrae i due nomi da una stringa tipo "Paolo e Francesca". */
export const parseCoupleNames = (name: string): [string, string] => {
  const parts = name.split(COUPLE_NAME_SEPARATOR).map((p) => p.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return [parts[0], parts[1]];
  }
  return [name, ""];
};

export const getAdultsCount = (
  isCouple: boolean | undefined,
  coupleMember1: boolean,
  coupleMember2: boolean,
): number => {
  if (isCouple !== true) return 1;
  return (coupleMember1 ? 1 : 0) + (coupleMember2 ? 1 : 0);
};

const getSavedCoupleMembers = (guest: Guest) => ({
  couple_member_1: guest.couple_member_1 ?? true,
  couple_member_2: guest.couple_member_2 ?? true,
});

export const getGuestTotalPeople = (guest: Guest): number => {
  if (guest.confirmed !== true) return 0;
  const { couple_member_1, couple_member_2 } = getSavedCoupleMembers(guest);
  return (
    getAdultsCount(guest.isCouple, couple_member_1, couple_member_2) +
    guest.kids_count
  );
};

export const getDefaultRSVPFormValues = (guest: Guest) => {
  const { couple_member_1, couple_member_2 } = guest.isCouple === true
    ? guest.confirmed === true
      ? getSavedCoupleMembers(guest)
      : { couple_member_1: true, couple_member_2: true }
    : { couple_member_1: false, couple_member_2: false };

  return {
    couple_member_1,
    couple_member_2,
    kids_count: guest.kids_count ?? 0,
  };
};
