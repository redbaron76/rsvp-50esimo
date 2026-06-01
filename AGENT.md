# Birthday Confirm — Stato Progetto

## Descrizione

App RSVP per gestione conferme alla festa di compleanno (11 Luglio 2026, Bar ACLI, Ronchi dei Legionari).

## Stack

- **Runtime**: Bun
- **Framework**: TanStack Start (file-based routing)
- **UI**: React 19 + Tailwind CSS v4 + shadcn/ui
- **Backend**: PocketBase (collection `birth_guests`)
- **State**: TanStack Query

## Struttura route

| Route               | File                            | Stato       |
| ------------------- | ------------------------------- | ----------- |
| `/`                 | `src/routes/index.tsx`          | Placeholder |
| `/confirm/:id`      | `src/routes/confirm.$id.tsx`    | Parziale    |
| `/admin`            | `src/routes/admin.tsx` (layout) | Placeholder |
| `/admin/login`      | `src/routes/admin/login.tsx`    | Placeholder |
| `/admin/dashboard`  | `src/routes/admin/dashboard.tsx`| Placeholder |

## Riferimento

Il PRD completo è in `docs/PRD.md`.
