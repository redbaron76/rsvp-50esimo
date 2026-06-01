import { useMemo, useCallback } from "react";
import { useAdminGuests } from "@/hooks/useAdminGuests";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { getGuestTotalPeople } from "@/lib/guest";
import { getGuestStatus } from "@/types";
import type { Guest, GuestStatus } from "@/types";

interface GuestRow {
  id: string;
  name: string;
  status: GuestStatus;
  totalPeople: number;
  confirmedAt: string | null;
}

const STATUS_ORDER: Record<GuestStatus, number> = {
  confirmed: 0,
  pending: 1,
  declined: 2,
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

const toGuestRow = (guest: Guest): GuestRow => {
  const status = getGuestStatus(guest);
  const totalPeople =
    status === "confirmed" ? getGuestTotalPeople(guest) : 0;

  return {
    id: guest.id,
    name: guest.name,
    status,
    totalPeople,
    confirmedAt: guest.confirmed_at,
  };
};

const buildCsv = (rows: GuestRow[]): string => {
  const statusLabel: Record<GuestStatus, string> = {
    confirmed: "Confermato",
    declined: "Non viene",
    pending: "In attesa",
  };

  const header = "Nome,Stato,Ospiti totali,Data conferma";
  const lines = rows.map(
    (r) =>
      `"${r.name}",${statusLabel[r.status]},${r.totalPeople},${formatDate(r.confirmedAt)}`,
  );
  return [header, ...lines].join("\n");
};

export const useAdminDashboard = () => {
  const { guests, isLoading, isError, isFetching, refetch } = useAdminGuests();
  const { logout } = useAdminAuth();

  const rows = useMemo(
    () =>
      guests
        .map(toGuestRow)
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]),
    [guests],
  );

  const stats = useMemo(() => {
    let confirmed = 0;
    let declined = 0;
    let pending = 0;
    let totalPeople = 0;

    for (const row of rows) {
      if (row.status === "confirmed") {
        confirmed++;
        totalPeople += row.totalPeople;
      } else if (row.status === "declined") {
        declined++;
      } else {
        pending++;
      }
    }

    return { confirmed, declined, pending, totalPeople };
  }, [rows]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExportCsv = useCallback(() => {
    const csv = buildCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invitati.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [rows]);

  return {
    rows,
    stats,
    isLoading,
    isError,
    isFetching,
    formatDate,
    handleRefresh,
    handleExportCsv,
    logout,
  };
};
