# PRD — Birthday Confirm

> App RSVP per gestione conferme festa di compleanno

**Versione**: 1.0  
**Ultimo aggiornamento**: 2026-04-05 (audit checklist)  
**Stato globale**: 🟡 In corso

---

## Indice

- [Panoramica](#panoramica)
- [Stack tecnologico](#stack-tecnologico)
- [Schema dati PocketBase](#schema-dati-pocketbase)
- [Struttura route](#struttura-route)
- [TASK-01 — Setup e scaffolding](#task-01--setup-e-scaffolding)
- [TASK-02 — Tipi TypeScript e client PocketBase](#task-02--tipi-typescript-e-client-pocketbase)
- [TASK-03 — Hook dati (guest, RSVP, contatore)](#task-03--hook-dati-guest-rsvp-contatore)
- [TASK-04 — Componente RSVPDialog](#task-04--componente-rsvpdialog)
- [TASK-05 — Home page](#task-05--home-page)
- [TASK-06 — Route /confirm/:token](#task-06--route-confirmtoken)
- [TASK-07 — Area admin — autenticazione](#task-07--area-admin--autenticazione)
- [TASK-08 — Area admin — dashboard conferme](#task-08--area-admin--dashboard-conferme)
- [TASK-09 — Stile finale e responsive](#task-09--stile-finale-e-responsive)
- [TASK-10 — Build e Docker](#task-10--build-e-docker)
- [Criteri di accettazione globali](#criteri-di-accettazione-globali)
- [Out of scope v1](#out-of-scope-v1)
- [Decision log](#decision-log)

---

## Panoramica

### Problema

Gli organizzatori di una festa di compleanno non hanno modo semplice di sapere quante persone parteciperanno. L'RSVP via WhatsApp/telefono è dispersivo e difficile da aggregare.

### Soluzione

App web leggera con link personalizzati per ogni invitato. Ogni link apre la home page con un dialog RSVP precompilato che si apre automaticamente. Gli organizzatori accedono a un'area riservata per vedere lo stato in tempo reale.

### Evento

| Campo       | Valore                                           |
| ----------- | ------------------------------------------------ |
| Data        | 11 Luglio 2026                                   |
| Orario      | dalle ore 18:00                                  |
| Luogo       | Bar ACLI, Ronchi dei Legionari                   |
| Festeggiati | 3 persone (foto da inserire in `public/images/`) |

### Utenti

- **Invitato**: riceve link personalizzato, conferma presenza e numero ospiti
- **Organizzatore**: accede a `/admin` con credenziali, vede stato conferme

---

## Stack tecnologico

| Componente  | Tecnologia                                                      |
| ----------- | --------------------------------------------------------------- |
| Runtime     | Bun                                                             |
| Bundler     | Vite                                                            |
| Framework   | TanStack Start + TanStack Router (file-based)                   |
| UI          | React 19                                                        |
| Stile       | Tailwind CSS v4 (no `tailwind.config.js`)                       |
| Componenti  | shadcn/ui                                                       |
| Database    | PocketBase (istanza esistente)                                  |
| State       | TanStack Query (server state), Zustand (UI state se necessario) |
| Validazione | Zod                                                             |
| Deployment  | Docker Compose (servizio esistente)                             |
| IDE         | Cursor                                                          |

---

## Schema dati PocketBase

### Collection `guests`

| Campo          | Tipo     | Obbligatorio | Note                                        |
| -------------- | -------- | ------------ | ------------------------------------------- |
| `id`           | string   | auto         | ID PocketBase                               |
| `name`         | string   | sì           | Nome completo invitato                      |
| `token`        | string   | sì           | Unique — usato nell'URL `/confirm/:token`   |
| `email`        | string   | no           | Opzionale                                   |
| `confirmed`    | bool     | no           | `null`=no risposta, `true`=sì, `false`=no   |
| `guests_count` | number   | no           | Ospiti aggiuntivi (0 = solo lui, default 0) |
| `confirmed_at` | datetime | no           | Timestamp aggiornato ad ogni modifica       |
| `notes`        | string   | no           | Note libere organizzatori                   |

### Auth

Usa la collection `_superusers` nativa di PocketBase per l'accesso admin.  
Non creare una collection custom per gli organizzatori.

---

## Struttura route

```
src/routes/
├── __root.tsx          # Layout root (font, meta, QueryClientProvider)
├── index.tsx           # / → Home page
├── confirm.$token.tsx  # /confirm/:token → Home + dialog RSVP auto-aperto
└── admin/
    ├── index.tsx       # /admin → redirect a /admin/login se non autenticato
    ├── login.tsx       # /admin/login → form login PocketBase
    └── dashboard.tsx   # /admin/dashboard → tabella conferme
```

---

## TASK-01 — Setup e scaffolding

**Obiettivo**: Progetto funzionante con dev server avviabile, routing configurato, dipendenze installate.  
**Stato**: 🟢 Completato  
**Stima**: 1-2h  
**Dipendenze**: nessuna

### Checklist

#### Inizializzazione progetto

- [x] `bun create @tanstack/start birthday-confirm` (o template equivalente)
- [x] Verificare che `bun run dev` avvii senza errori
- [x] Configurare `tsconfig.json` con `strict: true` e alias `@/ → src/`
- [x] Configurare `vite.config.ts` con alias `@/`

#### Tailwind CSS v4

- [x] Installare `tailwindcss@next` e `@tailwindcss/vite`
- [x] Aggiungere plugin Tailwind in `vite.config.ts`
- [x] Creare `src/index.css` con `@import "tailwindcss"` e blocco `@theme` vuoto (da popolare in TASK-05)
- [x] Verificare che una classe Tailwind di test funzioni nel browser
- [x] Confermare che **NON** esiste `tailwind.config.js`

#### shadcn/ui

- [x] Eseguire `bunx shadcn@latest init`
- [x] Selezionare stile `default`, base color `neutral`
- [x] Verificare che `src/lib/utils.ts` con `cn()` sia stato creato
- [x] Installare componenti minimi: `dialog`, `button`, `input`, `badge`, `table`, `label`

#### Dipendenze applicazione

- [x] `bun add pocketbase`
- [x] `bun add @tanstack/react-query`
- [x] `bun add zod`
- [x] Verificare `package.json` — nessuna dipendenza non necessaria

#### Struttura file iniziale

- [x] Creare `src/routes/__root.tsx` con layout base (html, body, Outlet)
- [x] Creare `src/routes/index.tsx` con placeholder `<h1>Home</h1>`
- [x] Creare `src/routes/confirm.$token.tsx` con placeholder
- [x] Creare `src/routes/admin/index.tsx`, `login.tsx`, `dashboard.tsx` con placeholder
- [x] Verificare che tutte le route siano raggiungibili nel browser

#### File di configurazione progetto

- [x] Creare `.env` e `.env.example` con `VITE_PB_URL=http://localhost:8090`
- [x] Aggiungere `.env` a `.gitignore`
- [x] Creare `AGENT.md` con stato iniziale del progetto

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-01.
Scaffola il progetto birthday-confirm seguendo esattamente la checklist.
Non aggiungere dipendenze non elencate.
Non implementare logica di business, solo struttura e boilerplate.
Al termine, elenca i file creati e conferma che `bun run dev` funziona.
```

---

## TASK-02 — Tipi TypeScript e client PocketBase

**Obiettivo**: Tipi condivisi e client PocketBase configurati e testabili.  
**Stato**: 🟢 Completato  
**Stima**: 30-45min  
**Dipendenze**: TASK-01 completato

### Checklist

#### Tipi

- [x] Creare `src/types/guest.ts` con interfaccia `Guest` (tutti i campi dello schema)
- [x] Creare tipo `RSVPPayload` per il payload di aggiornamento RSVP
- [x] Creare tipo `GuestStatus`: `'pending' | 'confirmed' | 'declined'`
- [x] Esportare tutto da `src/types/index.ts`

#### Client PocketBase

- [x] Creare `src/lib/pb.ts` con istanza singleton `PocketBase`
- [x] Leggere URL da `import.meta.env.VITE_PB_URL`
- [x] Aggiungere funzione helper `getGuestByToken(token: string): Promise<Guest>`
- [x] Aggiungere funzione helper `updateRSVP(id: string, payload: RSVPPayload): Promise<Guest>`
- [x] Aggiungere funzione helper `getAllGuests(): Promise<Guest[]>` (solo per admin)
- [x] Verificare che `bun run tsc --noEmit` passi senza errori

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-02 e lo schema dati in ## Schema dati PocketBase.
Crea i file elencati nella checklist.
Usa TypeScript strict, niente `any`.
Le funzioni helper in pb.ts devono gestire esplicitamente il caso 404
(getGuestByToken deve restituire null se il token non esiste, non lanciare).
```

---

## TASK-03 — Hook dati (guest, RSVP, contatore)

**Obiettivo**: Hook TanStack Query riutilizzabili per tutti gli accessi dati.  
**Stato**: 🟢 Completato  
**Stima**: 45-60min  
**Dipendenze**: TASK-02 completato

### Checklist

#### `useGuest`

- [x] Creare `src/hooks/useGuest.ts`
- [x] Parametro: `token: string`
- [x] Usa `useQuery` con `queryKey: ['guest', token]`
- [x] Chiama `getGuestByToken(token)` dal client PocketBase
- [x] Espone: `{ guest, isLoading, isError, notFound }`
- [x] `notFound: true` se la risposta è `null` (token inesistente)

#### `useRSVP`

- [x] Creare `src/hooks/useRSVP.ts`
- [x] Usa `useMutation` di TanStack Query
- [x] Payload: `{ guestId: string, confirmed: boolean, guests_count: number }`
- [x] Dopo successo: invalida query `['guest', token]` e `['guests-count']`
- [x] Espone: `{ submitRSVP, isSubmitting, isSuccess, isError }`

#### `useGuestCount`

- [x] Creare `src/hooks/useGuestCount.ts`
- [x] Usa `useQuery` con `queryKey: ['guests-count']`
- [x] Chiama PocketBase con filter `confirmed=true`
- [x] Calcola totale: somma di `(1 + guests_count)` per ogni guest confermato
- [x] Espone: `{ totalConfirmed, isLoading }`

#### `useAdminGuests`

- [x] Creare `src/hooks/useAdminGuests.ts`
- [x] Usa `useQuery` con `queryKey: ['admin-guests']`
- [x] Chiama `getAllGuests()` ordinato per `confirmed_at desc`
- [x] Espone: `{ guests, isLoading, isError }`

#### Configurazione QueryClient

- [x] Aggiungere `QueryClientProvider` in `src/routes/__root.tsx`
- [x] Configurare `staleTime: 30_000` (30 secondi)

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-03.
Crea i 4 hook elencati nella checklist in src/hooks/.
Usa TanStack Query v5 (sintassi con oggetto, non overload deprecati).
Non creare componenti UI, solo logica dati.
Aggiungi QueryClientProvider in __root.tsx se non presente.
Verifica con tsc --noEmit al termine.
```

---

## TASK-04 — Componente RSVPDialog

**Obiettivo**: Dialog RSVP funzionante, con stati, validazione e feedback visivo.  
**Stato**: 🟢 Completato  
**Stima**: 2-3h  
**Dipendenze**: TASK-03 completato

### Checklist

#### Struttura componente

- [x] Creare `src/components/RSVPDialog.tsx`
- [x] Props: `{ guest: Guest; open: boolean; onOpenChange: (open: boolean) => void }`
- [x] Usa `<Dialog>` di shadcn/ui (non Popover — compatibilità mobile)
- [x] Il dialog è controllato dall'esterno tramite `open`/`onOpenChange`

#### Contenuto dialog — step 1: scelta presenza

- [x] Intestazione: "Ciao, [nome invitato]! 🎉"
- [x] Sottotitolo: "Ci sarai alla festa?"
- [x] Due pulsanti grandi: "Sì, ci sarò! 🥳" / "Non posso venire 😔"
- [x] Se l'invitato ha già risposto, mostrare la sua scelta corrente evidenziata
- [x] Pulsante "Modifica risposta" visibile se già risposto

#### Contenuto dialog — step 2: numero ospiti (solo se "Sì")

- [x] Appare dopo aver scelto "Sì, ci sarò!"
- [x] Label: "Quanti ospiti porti con te? (moglie, figli, partner...)"
- [x] Stepper numerico: 0–8, default 0
- [x] Testo di riepilogo: "Verrete in [N] persone in totale"
- [x] Pulsante "Conferma" → chiama `useRSVP`

#### Feedback e stati

- [x] Stato loading durante submit: pulsante Conferma disabilitato con spinner
- [x] Dopo successo: messaggio animato "Perfetto! Ci vediamo l'11 luglio! 🎊"
- [x] Il dialog si chiude automaticamente dopo 2 secondi dal successo
- [x] Stato errore: messaggio inline "Ops, qualcosa è andato storto. Riprova."
- [x] Se "Non posso venire": conferma immediata senza step 2, messaggio "Peccato! Speriamo in un'altra occasione 💙"

#### Accessibilità

- [x] Focus trap all'apertura del dialog
- [x] Label associate a tutti gli input
- [x] `aria-live` per messaggi di feedback

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-04.
Crea src/components/RSVPDialog.tsx seguendo la checklist.
Usa Dialog di shadcn/ui, hook useRSVP da src/hooks/useRSVP.ts.
Il componente ha due step: scelta presenza → (se sì) numero ospiti.
Tutta la UI è in italiano.
Niente logica di routing nel componente — solo UI e mutation.
```

---

## TASK-05 — Home page

**Obiettivo**: Home page con stile festa, foto festeggiati, info evento e contatore.  
**Stato**: 🟢 Completato  
**Stima**: 2-3h  
**Dipendenze**: TASK-03 completato (per contatore), TASK-04 completato (per CTA)

### Checklist

#### Tema e font

- [x] Aggiungere in `src/index.css` via `@import` Google Fonts: "Pacifico" (titoli festa) + "Nunito" (body)
- [x] Definire nel blocco `@theme` in `index.css`:
  - `--color-festa-gold: #F5C518`
  - `--color-festa-pink: #FF6B9D`
  - `--color-festa-cream: #FFF8F0`
  - Font families per le variabili Tailwind v4

#### Sezione Hero

- [x] Sfondo con colore/gradiente festoso (`festa-cream` con decorazioni)
- [x] Foto dei 3 festeggiati in primo piano (da `public/images/festeggiati.jpg`)
  - Se la foto non esiste, usare placeholder con istruzioni per aggiunta
- [x] Titolo principale con font "Pacifico": testo personalizzabile
- [x] Data: "11 Luglio 2026" in evidenza
- [x] Orario: "dalle ore 18:00"
- [x] Luogo: "Bar ACLI — Ronchi dei Legionari" con emoji 📍

#### Contatore partecipanti

- [x] Sezione dedicata con numero grande e animato
- [x] Usa `useGuestCount` hook
- [x] Testo: "[N] persone hanno già confermato! 🎉"
- [x] Stato loading: skeleton/shimmer
- [x] Aggiornamento automatico (staleTime di 30s da TanStack Query)

#### Call to action

- [x] Pulsante grande "Conferma la tua presenza" → apre RSVPDialog
- [x] Visibile anche senza token (dialog parte dallo step 1)
- [x] Nota sotto il pulsante: "Hai ricevuto un link personale? Usalo per accedere direttamente!"

#### Footer

- [x] Link discreto `/admin` per gli organizzatori

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-05.
Crea src/components/HomePage.tsx e importalo in src/routes/index.tsx.
Usa i font Google "Pacifico" e "Nunito" importati in index.css.
Usa le variabili @theme definite in index.css per i colori.
Il componente usa useGuestCount per il contatore.
RSVPDialog va importato e aperto al click del pulsante CTA.
Per le foto, aspettati il file in public/images/festeggiati.jpg —
se non esiste, usa un placeholder colorato con testo "Foto festeggiati".
```

---

## TASK-06 — Route /confirm/:token

**Obiettivo**: Accedere a `/confirm/token_xxx` apre la home con il dialog RSVP già aperto e precompilato con i dati dell'invitato.  
**Stato**: 🟢 Completato  
**Stima**: 1h  
**Dipendenze**: TASK-04 e TASK-05 completati

### Checklist

#### Logica route

- [x] In `src/routes/confirm.$token.tsx` leggere il param `token` con `useParams`
- [x] Chiamare `useGuest(token)` per caricare i dati
- [x] Stato loading: mostrare home con skeleton nel posto del dialog
- [x] Stato `notFound`: mostrare home con banner "Link non valido o scaduto"
- [x] Stato guest trovato: aprire RSVPDialog automaticamente (useEffect al mount)

#### Comportamento dialog

- [x] Il dialog si apre con i dati dell'invitato precompilati
- [x] Se l'invitato ha già risposto, mostrare la sua scelta con opzione "Modifica"
- [x] Alla chiusura del dialog, l'utente rimane sulla home normalmente

#### SEO / meta

- [x] Titolo pagina personalizzato: "Festa — Conferma di [nome invitato]"

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-06.
Modifica src/routes/confirm.$token.tsx.
Usa useParams di TanStack Router per leggere il token.
Usa useGuest(token) — già creato in TASK-03.
Apri RSVPDialog automaticamente con useEffect al primo render se il guest esiste.
Renderizza <HomePage /> sotto il dialog in tutti i casi.
Non duplicare codice della home — importa il componente.
```

---

## TASK-07 — Area admin — autenticazione

**Obiettivo**: Login funzionante per gli organizzatori via PocketBase auth.  
**Stato**: 🟢 Completato  
**Stima**: 1-1.5h  
**Dipendenze**: TASK-02 completato

### Checklist

#### Hook autenticazione

- [x] Creare `src/hooks/useAdminAuth.ts`
- [x] Funzione `login(email, password)` → `pb.collection('_superusers').authWithPassword()`
- [x] Funzione `logout()` → `pb.authStore.clear()`
- [x] Proprietà `isAuthenticated` → `pb.authStore.isValid`
- [x] Persistenza: PocketBase salva il token in localStorage automaticamente

#### Pagina login

- [x] Creare UI in `src/routes/admin/login.tsx`
- [x] Form con campo email e password (componenti shadcn/ui `Input` + `Label`)
- [x] Pulsante "Accedi"
- [x] Stato loading durante il login
- [x] Errore inline se credenziali errate: "Email o password non corretti"
- [x] Dopo login riuscito: redirect a `/admin/dashboard`

#### Guard route admin

- [x] In `src/routes/admin/index.tsx`: redirect a `dashboard` se autenticato, a `login` se no
- [x] In `src/routes/admin/dashboard.tsx`: redirect a `login` se non autenticato
- [x] Non usare middleware complessi — semplice check `isAuthenticated` + redirect

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-07.
Crea useAdminAuth.ts e la pagina di login admin.
Usa pb.admins.authWithPassword() per l'autenticazione.
Il redirect dopo login va a /admin/dashboard.
Usa Navigate di TanStack Router per i redirect, non window.location.
Tutta la UI in italiano.
```

---

## TASK-08 — Area admin — dashboard conferme

**Obiettivo**: Dashboard che mostra lo stato di tutti gli invitati.  
**Stato**: 🟢 Completato  
**Stima**: 2h  
**Dipendenze**: TASK-07 completato, TASK-03 completato

### Checklist

#### Layout dashboard

- [x] Header con titolo "Dashboard Organizzatori" + pulsante "Esci"
- [x] Riepilogo in cima: 3 card con totali
  - "Confermati" (verde): count + persone totali
  - "Rifiutati" (rosso): count
  - "In attesa" (grigio): count
- [x] Tabella invitati sotto

#### Tabella invitati

- [x] Colonne: Nome | Stato | Ospiti | Data conferma | Note
- [x] Badge colorati per stato:
  - 🟢 "Confermato" (verde)
  - 🔴 "Non viene" (rosso)
  - ⚪ "In attesa" (grigio)
- [x] Ordinamento default: confermati per primi, poi in attesa, poi rifiutati
- [x] Ogni riga mostra "X persone in totale" (1 + guests_count) se confermato
- [x] Aggiornamento dati manuale con pulsante "Aggiorna"

#### Export CSV (opzionale v1)

- [x] Pulsante "Esporta CSV" che scarica la lista completa
- [x] Colonne CSV: nome, email, stato, ospiti, data conferma

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-08.
Crea la UI in src/routes/admin/dashboard.tsx.
Usa useAdminGuests hook (TASK-03) per i dati.
Usa Table di shadcn/ui per la tabella.
Le 3 card di riepilogo calcolano i totali dai dati locali (no fetch separati).
Il pulsante Esci chiama logout() da useAdminAuth.
```

---

## TASK-09 — Stile finale e responsive

**Obiettivo**: App rifinita, mobile-first, coerente su tutti i breakpoint.  
**Stato**: 🟢 Completato  
**Stima**: 2-3h  
**Dipendenze**: tutti i task precedenti completati

### Checklist

#### Mobile (priorità)

- [x] Home page leggibile e usabile su iPhone SE (375px)
- [x] RSVPDialog occupa la maggior parte dello schermo su mobile
- [x] Pulsanti abbastanza grandi per touch (min 44px height)
- [x] Font size adeguata senza zoom involontario (min 16px su input)

#### Animazioni e dettagli

- [x] Animazione apertura dialog (fade + slide from bottom su mobile)
- [x] Animazione contatore (numero che "sale" al load)
- [x] Confetti o particelle al submit RSVP positivo (opzionale, usa canvas-confetti)
- [x] Transizioni di pagina leggere

#### Consistenza visiva

- [x] Colori coerenti con il tema `@theme` definito in TASK-05
- [x] Tutti i testi in italiano, nessuna stringa in inglese visibile all'utente
- [x] Favicon personalizzato (emoji 🎉 come favicon SVG)
- [x] Meta tag `og:image` con foto festeggiati per condivisione social

#### Cross-browser

- [ ] Testato su Chrome mobile (Android)
- [ ] Testato su Safari mobile (iOS)
- [ ] Testato su Chrome desktop

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-09.
Revisiona tutti i componenti per la checklist mobile.
Non cambiare la logica, solo stile e layout.
Per le animazioni usa CSS transitions/keyframes di Tailwind v4.
Aggiungi canvas-confetti solo se non introduce conflitti con le dipendenze esistenti.
```

---

## TASK-10 — Build e Docker

**Obiettivo**: Build di produzione funzionante, integrata nel Docker Compose esistente.  
**Stato**: 🔴 Non iniziato  
**Stima**: 1-2h  
**Dipendenze**: TASK-09 completato

### Checklist

#### Build Vite

- [ ] `bun run build` completa senza errori
- [ ] Output in `dist/` (o cartella configurata)
- [ ] Verificare che le variabili `VITE_PB_URL` siano passate correttamente in build

#### Dockerfile

- [ ] Creare `Dockerfile` multi-stage:
  - Stage `builder`: `oven/bun` → `bun install` + `bun run build`
  - Stage finale: `nginx:alpine` → copia `dist/` in `/usr/share/nginx/html`
- [ ] Creare `nginx.conf` con:
  - `try_files $uri /index.html` per SPA routing
  - Gzip abilitato
  - Cache headers per assets statici

#### Docker Compose

- [ ] Aggiungere servizio `birthday-confirm` al `docker-compose.yml` esistente
  - `build: .`
  - `ports: - "3000:80"` (o porta concordata)
  - `environment: - VITE_PB_URL=http://pocketbase:8090` (nome servizio PB nel compose)
  - `restart: unless-stopped`
- [ ] Verificare che la rete Docker sia condivisa con il servizio PocketBase

#### Verifica finale

- [ ] `docker compose up --build` avvia senza errori
- [ ] App raggiungibile su `http://localhost:3000`
- [ ] `/confirm/token_test` funziona (anche con token inesistente — mostra errore corretto)
- [ ] `/admin/login` funziona con credenziali PocketBase reali

### Prompt consigliato per Cursor Agent

```
Leggi PRD.md sezione TASK-10.
Crea Dockerfile multi-stage e nginx.conf come da checklist.
NON modificare il docker-compose.yml esistente — mostrami solo
lo snippet del servizio da aggiungere manualmente.
Verifica che nginx.conf gestisca il routing SPA (try_files → index.html).
```

---

## Criteri di accettazione globali

Prima del deploy finale, verificare:

- [ ] Un invitato può aprire `/confirm/token_xxx` e confermare la presenza senza assistenza
- [ ] Il contatore in home si aggiorna correttamente dopo una conferma
- [ ] Un invitato può tornare sul suo link e modificare la risposta
- [ ] Un organizzatore può accedere a `/admin` e vedere tutte le conferme
- [ ] L'app funziona su smartphone (iOS e Android)
- [ ] Non ci sono errori in console in nessuno dei flussi principali
- [ ] `bun run tsc --noEmit` passa senza errori

---

## Out of scope v1

Le seguenti funzionalità sono escluse dalla v1 e valutabili per versioni future:

- Invio email automatico agli invitati
- QR code generato automaticamente per ogni invitato
- Notifiche push/email agli organizzatori a ogni nuova conferma
- Multilingua (solo italiano)
- Pagamenti o biglietteria
- Gestione di più eventi
- Import invitati da CSV (gli invitati vanno inseriti manualmente in PocketBase)

---

## Decision log

| Data       | Decisione                                 | Motivazione                                                |
| ---------- | ----------------------------------------- | ---------------------------------------------------------- |
| 2026-04-05 | Uso `Dialog` invece di `Popover` per RSVP | Migliore compatibilità mobile, focus trap nativo           |
| 2026-04-05 | Auth admin via `pb.admins` nativa         | Evita collection custom, più semplice da gestire           |
| 2026-04-05 | Token non scade                           | V1: semplicità. Valutare exipiry in v2                     |
| 2026-04-05 | No SSR per le route principali            | TanStack Start usato in modalità SPA per semplicità deploy |
|            |                                           |                                                            |

---

_Aggiorna questo file a ogni task completato: cambia lo stato da 🔴 a 🟡 (in corso) a 🟢 (completato) e spunta le checkbox._
