import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SubmitActionsProps {
  choice: boolean | null
  isSubmitting: boolean
  submitLabel: string
  submitDisabled?: boolean
  onBack: () => void
}

export const SubmitActions = ({
  choice,
  isSubmitting,
  submitLabel,
  submitDisabled = false,
  onBack,
}: SubmitActionsProps) => (
  <div className="flex flex-col gap-2 animate-in fade-in duration-200">
    <Button
      type="submit"
      className={cn(
        "w-full min-h-11 text-base",
        choice
          ? "bg-sunset hover:bg-terracotta"
          : "bg-muted-foreground hover:bg-muted-foreground/80",
      )}
      disabled={isSubmitting || submitDisabled}
    >
      {isSubmitting ? "Invio in corso…" : submitLabel}
    </Button>
    <Button
      type="button"
      variant="ghost"
      className="min-h-11"
      onClick={onBack}
      disabled={isSubmitting}
    >
      ← Torna indietro
    </Button>
  </div>
)
