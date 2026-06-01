import { Button } from "@/components/ui/button"
import type { RsvpCopy } from "@/lib/rsvpCopy"

interface ChooseStepProps {
  copy: RsvpCopy
  onChoose: (value: boolean) => void
}

export const ChooseStep = ({ copy, onChoose }: ChooseStepProps) => (
  <div className="grid grid-cols-2 gap-3">
    <Button
      type="button"
      size="lg"
      className="h-20 text-base cursor-pointer"
      onClick={() => onChoose(true)}
    >
      {copy.chooseYes}
    </Button>
    <Button
      type="button"
      size="lg"
      variant="outline"
      className="h-20 text-base cursor-pointer"
      onClick={() => onChoose(false)}
    >
      {copy.chooseNoLine1}
      <br />
      {copy.chooseNoLine2}
    </Button>
  </div>
)
