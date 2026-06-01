import { useQuery } from "@tanstack/react-query";
import { getGuestById } from "@/apis/guests";

export const useGuest = (id: string) => {
  const query = useQuery({
    queryKey: ["guest", id],
    queryFn: () => getGuestById(id),
    enabled: id.length > 0,
  });

  const notFound = query.isSuccess && query.data === null;

  return { ...query, notFound };
};
