import { useQuery } from "@tanstack/react-query";
import { getConfirmedGuests } from "@/apis/guests";
import { getGuestTotalPeople } from "@/lib/guest";

export const useGuestCount = () => {
  const query = useQuery({
    queryKey: ["guests-count"],
    queryFn: getConfirmedGuests,
    staleTime: 30_000,
    select: (guests) =>
      guests.reduce((sum, g) => sum + getGuestTotalPeople(g), 0),
  });

  return {
    totalConfirmed: query.data ?? 0,
    isLoading: query.isLoading,
  };
};
