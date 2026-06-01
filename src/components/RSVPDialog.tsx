import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRSVP } from "@/hooks/useRSVP"
import { SuccessMessage } from "@/components/rsvp/SuccessMessage"
import { RSVPHeader } from "@/components/rsvp/RSVPHeader"
import { SummaryStep } from "@/components/rsvp/SummaryStep"
import { ChooseStep } from "@/components/rsvp/ChooseStep"
import { SubmitActions } from "@/components/rsvp/SubmitActions"
import { CoupleMembersStep } from "@/components/rsvp/CoupleMembersStep"
import { getRsvpCopy } from "@/lib/rsvpCopy"
import type { Guest } from "@/types"

interface RSVPDialogProps {
  guest: Guest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const RSVPDialog = ({ guest, open, onOpenChange }: RSVPDialogProps) => {
  const {
    form,
    step,
    choice,
    totalGuests,
    isCouple,
    coupleNames,
    coupleMembersValid,
    isSubmitting,
    isSuccess,
    isError,
    handleChoose,
    handleBack,
    handleEdit,
  } = useRSVP({ guest, open, onOpenChange })

  const copy = getRsvpCopy(isCouple === true)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" showCloseButton={!isSuccess}>
        {isSuccess ? (
          <SuccessMessage choice={choice} copy={copy} />
        ) : (
          <>
            <RSVPHeader name={guest.name} step={step} copy={copy} />

            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
              className="flex flex-col gap-4 pt-2"
            >
              {step === "summary" && (
                <SummaryStep
                  confirmed={guest.confirmed}
                  totalGuests={totalGuests}
                  copy={copy}
                  onEdit={handleEdit}
                />
              )}

              {step === "choose" && (
                <ChooseStep copy={copy} onChoose={handleChoose} />
              )}

              {step === "details" && (
                <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {isCouple && coupleNames && (
                    <>
                      <form.Field name="couple_member_1">
                        {(field1) => (
                          <form.Field name="couple_member_2">
                            {(field2) => (
                              <CoupleMembersStep
                                names={coupleNames}
                                member1Checked={field1.state.value}
                                member2Checked={field2.state.value}
                                onMember1Change={(v) =>
                                  field1.handleChange(v)
                                }
                                onMember2Change={(v) =>
                                  field2.handleChange(v)
                                }
                              />
                            )}
                          </form.Field>
                        )}
                      </form.Field>
                      {!coupleMembersValid && (
                        <p
                          className="text-sm text-center text-destructive"
                          role="alert"
                        >
                          Seleziona almeno una persona della coppia.
                        </p>
                      )}
                    </>
                  )}

                  <form.Field name="kids_count">
                    {(field) => (
                      <fieldset className="flex flex-col gap-3">
                        <legend className="text-sm font-medium text-center w-full">
                          {copy.kidsLegend}
                        </legend>
                        <div className="flex items-center justify-center gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 text-lg"
                            onClick={() =>
                              field.handleChange(
                                Math.max(0, field.state.value - 1),
                              )
                            }
                            disabled={field.state.value === 0}
                            aria-label="Rimuovi un bambino"
                          >
                            −
                          </Button>
                          <Input
                            type="number"
                            min={0}
                            max={8}
                            value={field.state.value}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10)
                              if (!isNaN(v))
                                field.handleChange(
                                  Math.min(8, Math.max(0, v)),
                                )
                            }}
                            aria-label="Numero di bambini"
                            className="h-10 w-16 text-center text-lg [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 text-lg"
                            onClick={() =>
                              field.handleChange(
                                Math.min(8, field.state.value + 1),
                              )
                            }
                            disabled={field.state.value === 8}
                            aria-label="Aggiungi un bambino"
                          >
                            +
                          </Button>
                        </div>
                      </fieldset>
                    )}
                  </form.Field>

                  <p className="text-xs text-muted-foreground text-center">
                    {totalGuests === 0
                      ? "Seleziona chi partecipa"
                      : totalGuests === 1
                        ? "Verrà 1 persona"
                        : `Verrete in ${totalGuests} person${totalGuests === 2 ? "a" : "e"} in totale`}
                  </p>
                </div>
              )}

              {step === "decline-confirm" && (
                <p className="text-center text-sm text-muted-foreground animate-in fade-in duration-300">
                  {copy.declineConfirm}
                </p>
              )}

              {(step === "details" || step === "decline-confirm") && (
                <SubmitActions
                  choice={choice}
                  isSubmitting={isSubmitting}
                  submitLabel={copy.submit}
                  submitDisabled={step === "details" && !coupleMembersValid}
                  onBack={handleBack}
                />
              )}

              {isError && (
                <p
                  className="text-sm text-center text-destructive"
                  role="alert"
                  aria-live="assertive"
                >
                  Ops, qualcosa è andato storto. Riprova.
                </p>
              )}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
