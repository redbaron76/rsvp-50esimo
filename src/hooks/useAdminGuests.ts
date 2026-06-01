import { useQuery } from "@tanstack/react-query";
import { getAllGuests } from "@/apis/guests";

export const useAdminGuests = () => {
  const query = useQuery({
    queryKey: ["admin-guests"],
    queryFn: getAllGuests,
  });

  return {
    guests: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
};
