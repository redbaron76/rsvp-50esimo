import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Red, Mari e Kiki fanno 50 anni! Festa Sabato 11 Luglio 2026" },
      {
        name: "description",
        content:
          "Conferma la tua presenza alla festa di compleanno di Red, Mari e Kiki!",
      },
      {
        property: "og:title",
        content: "Red, Mari e Kiki fanno 50 anni! Festa Sabato 11 Luglio 2026",
      },
      {
        property: "og:description",
        content:
          "Conferma la tua presenza alla festa di compleanno di Red, Mari e Kiki! 11 Luglio 2026, ore 18:00 — Bar ACLI, Ronchi dei Legionari",
      },
      {
        property: "og:image",
        content: "https://red-mari-kiki.bisiacaria.com/images/rushmore.jpg",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <TanStackDevtools
          config={{ position: "bottom-right" }}
          plugins={[
            { name: "Router", render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">Pagina non trovata</p>
      </div>
    </div>
  );
}
