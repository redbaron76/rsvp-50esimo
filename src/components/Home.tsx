import { Button } from "@/components/ui/button";
import { useHomePage } from "@/hooks/useHomePage";
import { getRsvpCopy } from "@/lib/rsvpCopy";

interface HomeProps {
  onCTAClick?: () => void;
  isCouple?: boolean;
}

export const Home = ({ onCTAClick, isCouple = false }: HomeProps) => {
  const { displayCount, isCountLoading } = useHomePage();
  const { cta: ctaLabel } = getRsvpCopy(isCouple);

  return (
    <div className="page-enter flex min-h-dvh flex-col bg-sand">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col overflow-hidden bg-gradient-to-b from-sand via-warm/40 to-sand px-4 pt-[max(1.25rem,env(safe-area-inset-top))] text-center sm:block sm:flex-none sm:pt-14 sm:pb-10">
        {/* Decorazione sottile — linea sfumata */}
        <div
          className="pointer-events-none absolute inset-0 select-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-sunset/25 to-transparent" />
        </div>

        {/* Intro */}
        <div className="relative shrink-0">
          <p className="mb-1.5 text-xs font-semibold tracking-[0.2em] uppercase text-teal sm:mb-2 sm:text-sm sm:tracking-[0.25em]">
            Save the date
          </p>
          <h1 className="font-display text-[2.35rem] leading-[1.05] font-bold sm:text-5xl sm:leading-[1.1] md:text-6xl">
            <span className="text-terracotta">Red</span>
            <span className="font-normal text-muted-foreground/70">, </span>
            <span className="text-foreground">Mari</span>
            <span className="font-normal text-muted-foreground/70"> e </span>
            <span className="text-teal">Kiki</span>
          </h1>
          <p className="mx-auto mt-2.5 max-w-md text-base italic leading-snug text-muted-foreground sm:mt-4 sm:text-lg sm:leading-relaxed">
            Tre pezzi da 90 intanto ne fanno 50
          </p>
        </div>

        {/* Foto festeggiati — cresce per riempire lo spazio verticale su mobile */}
        <div className="flex min-h-0 flex-1 flex-col justify-center py-3 sm:flex-none sm:py-0">
          <div className="relative mx-auto flex h-full min-h-[22dvh] w-full max-w-md flex-col sm:mt-8 sm:min-h-0 sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
            <div className="h-full min-h-[22dvh] overflow-hidden rounded-xl border border-sunset/15 shadow-lg ring-1 ring-black/[0.04] sm:min-h-0 sm:rounded-2xl">
              <img
                src="/images/rushmore.jpg"
                alt="I festeggiati"
                width={1794}
                height={1332}
                className="h-full min-h-[22dvh] w-full object-cover object-[center_35%] sm:aspect-[4/3] sm:min-h-0 sm:object-center"
                onError={(e) => {
                  const target = e.currentTarget;
                  const container = target.parentElement;
                  const fallback =
                    container?.nextElementSibling as HTMLElement | null;
                  if (container) container.style.display = "none";
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            </div>
            <div className="hidden min-h-[22dvh] w-full items-center justify-center rounded-xl border-2 border-dashed border-sunset/20 bg-warm/50 text-foreground sm:aspect-[4/3] sm:min-h-0 sm:rounded-2xl">
              <div className="text-center">
                <p className="text-sm font-medium">Foto dei festeggiati</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Aggiungi public/images/rushmore.jpg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info evento + intrattenimento */}
        <div className="relative shrink-0 space-y-3 pb-1 sm:space-y-0">
          <div className="mx-auto max-w-lg space-y-1 sm:mt-10 sm:space-y-3">
            <p className="font-display text-xl font-bold uppercase leading-tight tracking-[0.03em] text-sunset sm:text-3xl sm:tracking-[0.04em] md:text-4xl">
              Sabato 11 Luglio 2026
            </p>
            <p className="text-sm text-foreground/85 sm:text-xl">
              presso il <strong>Bar ACLI</strong> — Ronchi dei Legionari
            </p>
            <p className="text-xs text-muted-foreground sm:text-lg">
              dalle ore 18.00 in avanti
            </p>
          </div>

          <div className="mx-auto max-w-lg border-t border-sunset/15 pt-3 sm:mt-10 sm:pt-8">
            <p className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-muted-foreground sm:text-sm sm:tracking-[0.2em]">
              Ad animare la serata
            </p>
            <p className="font-display mt-1 text-xl font-semibold text-teal sm:mt-2 sm:text-3xl">
              Zippo dj & The Followers
            </p>
          </div>
        </div>
      </section>

      {/* Contatore + CTA */}
      <section className="mx-auto w-full max-w-lg shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:pb-12 sm:pt-4">
        <div className="rounded-2xl border border-sunset/15 bg-white/80 px-4 py-5 text-center shadow-sm sm:px-6 sm:py-6">
          {isCountLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-20 animate-pulse rounded-lg bg-sunset-soft/20" />
              <div className="h-5 w-48 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <>
              <p className="font-display text-5xl font-bold text-sunset tabular-nums sm:text-6xl">
                {displayCount}
              </p>
              <p className="mt-2 text-base text-muted-foreground">
                {displayCount === 1
                  ? "persona ha già confermato"
                  : "persone hanno già confermato"}
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex flex-col items-stretch gap-3 sm:mt-6">
          <Button
            size="lg"
            className="min-h-12 w-full cursor-pointer bg-sunset py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-terracotta hover:shadow-lg active:scale-[0.98]"
            onClick={onCTAClick}
          >
            {ctaLabel}
          </Button>
          {!onCTAClick && (
            <p className="text-center text-sm text-muted-foreground">
              Hai ricevuto un link personale? Usalo per accedere direttamente.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
