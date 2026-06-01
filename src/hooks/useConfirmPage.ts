import { useEffect, useState } from "react";

import { useGuest } from "@/hooks/useGuest";

const DEFAULT_TITLE =
  "Red, Mari e Kiki fanno 50 anni! Festa Sabato 11 Luglio 2026";

export const useConfirmPage = (id: string) => {
  const { data: guest, isLoading, notFound } = useGuest(id);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!guest) {
      document.title = DEFAULT_TITLE;
      return;
    }
    document.title = `Festa — Conferma di ${guest.name}`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [guest?.name]);

  return {
    guest,
    isLoading,
    notFound,
    dialogOpen,
    setDialogOpen,
  };
};
