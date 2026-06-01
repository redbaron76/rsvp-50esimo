import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CoupleMembersStepProps {
  names: [string, string];
  member1Checked: boolean;
  member2Checked: boolean;
  onMember1Change: (checked: boolean) => void;
  onMember2Change: (checked: boolean) => void;
}

export const CoupleMembersStep = ({
  names,
  member1Checked,
  member2Checked,
  onMember1Change,
  onMember2Change,
}: CoupleMembersStepProps) => (
  <fieldset className="flex flex-col gap-3 rounded-lg border p-4">
    <legend className="text-sm font-medium px-1">Chi partecipa?</legend>
    <div className="flex items-center gap-3">
      <Checkbox
        id="rsvp-couple-member-1"
        checked={member1Checked}
        onCheckedChange={(v) => onMember1Change(v === true)}
        aria-label={`${names[0]} partecipa`}
      />
      <Label
        htmlFor="rsvp-couple-member-1"
        className="flex-1 cursor-pointer text-sm font-medium"
      >
        {names[0]}
      </Label>
    </div>
    <div className="flex items-center gap-3">
      <Checkbox
        id="rsvp-couple-member-2"
        checked={member2Checked}
        onCheckedChange={(v) => onMember2Change(v === true)}
        aria-label={`${names[1]} partecipa`}
      />
      <Label
        htmlFor="rsvp-couple-member-2"
        className="flex-1 cursor-pointer text-sm font-medium"
      >
        {names[1]}
      </Label>
    </div>
  </fieldset>
);
