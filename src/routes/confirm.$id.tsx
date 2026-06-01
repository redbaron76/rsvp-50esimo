import { createFileRoute } from "@tanstack/react-router"
import Home from "@/components/Home"
import { RSVPDialog } from "@/components/RSVPDialog"
import { useConfirmPage } from "@/hooks/useConfirmPage"

export const Route = createFileRoute("/confirm/$id")({
  component: ConfirmPage,
})

function ConfirmPage() {
  const { id } = Route.useParams()
  const { guest, isLoading, notFound, dialogOpen, setDialogOpen } =
    useConfirmPage(id)

  if (isLoading) {
    return (
      <>
        <Home />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <p className="text-muted-foreground animate-pulse">Caricamento…</p>
        </div>
      </>
    )
  }

  if (notFound) {
    return (
      <>
        <Home />
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="mx-4 max-w-sm rounded-xl border border-border bg-card p-8 text-center shadow-lg">
            <h2 className="text-xl font-bold font-display">Link non valido</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Questo invito non esiste o è stato rimosso.
              <br />
              Se pensi sia un errore, contatta gli organizzatori.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Home
        onCTAClick={() => setDialogOpen(true)}
        isCouple={guest?.isCouple === true}
      />
      {guest && (
        <RSVPDialog
          guest={guest}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  )
}
