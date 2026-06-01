import type { RsvpCopy } from "@/lib/rsvpCopy"

interface SuccessMessageProps {
  choice: boolean | null
  copy: RsvpCopy
}

export const SuccessMessage = ({ choice, copy }: SuccessMessageProps) => (
  <div
    className="flex flex-col items-center gap-4 py-6 animate-in fade-in zoom-in-95 duration-500"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <span className="h-px w-8 bg-sunset/30" />
      <span className="text-sunset-soft text-sm">&#9679;</span>
      <span className="h-px w-8 bg-teal/30" />
    </div>
    <p className="text-center text-lg font-semibold font-display">
      {choice ? copy.successConfirmed : copy.successDeclined}
    </p>
  </div>
)
