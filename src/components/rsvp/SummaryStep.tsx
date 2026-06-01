import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { RsvpCopy } from "@/lib/rsvpCopy"

interface SummaryStepProps {
  confirmed: boolean | null
  totalGuests: number
  copy: RsvpCopy
  onEdit: () => void
}

export const SummaryStep = ({
  confirmed,
  totalGuests,
  copy,
  onEdit,
}: SummaryStepProps) => (
  <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
    <div
      className={cn(
        "w-full rounded-lg border-2 p-5 text-center",
        confirmed
          ? "border-teal/30 bg-teal-soft/15"
          : "border-muted-foreground/20 bg-muted/30",
      )}
    >
      <p className="font-semibold">
        {confirmed ? copy.summaryConfirmed : copy.summaryDeclined}
      </p>
      {confirmed && (
        <p className="mt-1 text-sm text-muted-foreground">
          {totalGuests === 1
            ? "Parteciperà 1 persona"
            : `Verrete in ${totalGuests} person${totalGuests === 2 ? "a" : "e"}`}
        </p>
      )}
    </div>
    <Button type="button" variant="outline" className="min-h-11 cursor-pointer" onClick={onEdit}>
      Modifica risposta
    </Button>
  </div>
)
