import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RsvpCopy } from "@/lib/rsvpCopy";

interface RSVPHeaderProps {
  name: string;
  step: string;
  copy: RsvpCopy;
}

export const RSVPHeader = ({ name, step, copy }: RSVPHeaderProps) => (
  <DialogHeader>
    <DialogTitle className="text-center text-xl font-display">
      Ciao, {name}!
    </DialogTitle>
    <DialogDescription className="text-center">
      {step === "summary"
        ? copy.headerSummary
        : step === "choose"
          ? copy.headerChoose
          : copy.headerDetails}
      <br />
      <span className="font-medium text-foreground">
        11 Luglio 2026 — ore 18:00
      </span>
    </DialogDescription>
  </DialogHeader>
);
