export interface RsvpCopy {
  cta: string;
  headerSummary: string;
  headerChoose: string;
  headerDetails: string;
  chooseYes: string;
  chooseNoLine1: string;
  chooseNoLine2: string;
  summaryConfirmed: string;
  summaryDeclined: string;
  kidsLegend: string;
  declineConfirm: string;
  submit: string;
  successConfirmed: string;
  successDeclined: string;
}

export const getRsvpCopy = (isCouple: boolean): RsvpCopy =>
  isCouple
    ? {
        cta: "Confermate la vostra presenza",
        headerSummary: "Ecco la vostra risposta attuale",
        headerChoose: "Venite anche voi a festeggiare con noi?",
        headerDetails: "Ci sarete alla festa?",
        chooseYes: "Sì, ci saremo!",
        chooseNoLine1: "Ci dispiace,",
        chooseNoLine2: "non possiamo",
        summaryConfirmed: "Avete confermato la vostra presenza!",
        summaryDeclined: "Avete indicato che non potete venire",
        kidsLegend: "Quanti bambini portate con voi?",
        declineConfirm: "Confermate che non potrete partecipare?",
        submit: "Confermate",
        successConfirmed: "Perfetto! Ci vediamo l'11 luglio.",
        successDeclined: "Peccato, speriamo in un'altra occasione.",
      }
    : {
        cta: "Conferma la tua presenza",
        headerSummary: "Ecco la tua risposta attuale",
        headerChoose: "Vieni anche tu a festeggiare con noi?",
        headerDetails: "Ci sarai alla festa?",
        chooseYes: "Sì, ci sarò!",
        chooseNoLine1: "Mi dispiace,",
        chooseNoLine2: "non posso",
        summaryConfirmed: "Hai confermato la tua presenza!",
        summaryDeclined: "Hai indicato che non puoi venire",
        kidsLegend: "Quanti bambini porti con te?",
        declineConfirm: "Confermi che non potrai partecipare?",
        submit: "Conferma",
        successConfirmed: "Perfetto! Ci vediamo l'11 luglio.",
        successDeclined: "Peccato, speriamo in un'altra occasione.",
      };
