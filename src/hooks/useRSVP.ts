import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { updateRSVP } from "@/apis/guests";
import {
  getAdultsCount,
  getDefaultRSVPFormValues,
  getGuestTotalPeople,
  parseCoupleNames,
} from "@/lib/guest";
import type { Guest, RSVPPayload } from "@/types";

export type RSVPStep = "summary" | "choose" | "details" | "decline-confirm";

export interface RSVPFormValues {
  couple_member_1: boolean;
  couple_member_2: boolean;
  kids_count: number;
}

interface UseRSVPOptions {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const useRSVP = ({ guest, open, onOpenChange }: UseRSVPOptions) => {
  const queryClient = useQueryClient();
  const hasAlreadyResponded =
    guest.confirmed_at !== null && guest.confirmed_at !== "";

  const [step, setStep] = useState<RSVPStep>(
    hasAlreadyResponded ? "summary" : "choose",
  );
  const [choice, setChoice] = useState<boolean | null>(null);

  const coupleNames = useMemo(
    () => (guest.isCouple ? parseCoupleNames(guest.name) : null),
    [guest.isCouple, guest.name],
  );

  const mutation = useMutation({
    mutationFn: (payload: RSVPPayload) => updateRSVP(guest.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest"] });
      queryClient.invalidateQueries({ queryKey: ["guests-count"] });
    },
  });

  const form = useForm({
    defaultValues: getDefaultRSVPFormValues(guest),
    onSubmit: ({ value }) => {
      if (choice === null) return;
      if (
        choice &&
        guest.isCouple &&
        !value.couple_member_1 &&
        !value.couple_member_2
      ) {
        return;
      }
      mutation.mutate({
        confirmed: choice,
        couple_member_1: choice && guest.isCouple ? value.couple_member_1 : false,
        couple_member_2: choice && guest.isCouple ? value.couple_member_2 : false,
        kids_count: choice ? value.kids_count : 0,
        confirmed_at: new Date().toISOString(),
      });
    },
  });

  const coupleMember1 = useStore(form.store, (s) => s.values.couple_member_1);
  const coupleMember2 = useStore(form.store, (s) => s.values.couple_member_2);
  const kidsCountValue = useStore(form.store, (s) => s.values.kids_count);

  const adultsCount = getAdultsCount(
    guest.isCouple,
    coupleMember1,
    coupleMember2,
  );

  const totalGuests = useMemo(() => {
    if (step === "summary" && guest.confirmed === true) {
      return getGuestTotalPeople(guest);
    }
    return adultsCount + kidsCountValue;
  }, [step, guest, adultsCount, kidsCountValue]);

  const coupleMembersValid =
    !guest.isCouple || adultsCount > 0;

  useEffect(() => {
    if (mutation.isSuccess) {
      if (choice) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.7 },
          colors: ["#F5C518", "#FF6B9D", "#ff6347", "#ffd700", "#ff69b4"],
        });
      }
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [mutation.isSuccess, onOpenChange, choice]);

  useEffect(() => {
    if (!open) {
      setStep(hasAlreadyResponded ? "summary" : "choose");
      setChoice(null);
      form.reset(getDefaultRSVPFormValues(guest));
      mutation.reset();
    }
  }, [open, hasAlreadyResponded, guest.id]);

  const handleChoose = useCallback((value: boolean) => {
    setChoice(value);
    setStep(value ? "details" : "decline-confirm");
    if (value && guest.isCouple) {
      form.setFieldValue("couple_member_1", true);
      form.setFieldValue("couple_member_2", true);
    }
  }, [guest.isCouple, form]);

  const handleBack = useCallback(() => {
    setStep("choose");
    setChoice(null);
    form.reset(getDefaultRSVPFormValues(guest));
    mutation.reset();
  }, [guest.id]);

  const handleEdit = useCallback(() => {
    setStep("choose");
    setChoice(null);
    mutation.reset();
  }, []);

  return {
    form,
    step,
    choice,
    totalGuests,
    hasAlreadyResponded,
    isCouple: guest.isCouple === true,
    coupleNames,
    coupleMembersValid,

    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,

    handleChoose,
    handleBack,
    handleEdit,
  };
};
