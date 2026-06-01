import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LogOut,
  RefreshCw,
  Download,
  Upload,
  Users,
  UserX,
  Clock,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import type { GuestStatus } from "@/types";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

const statusConfig: Record<
  GuestStatus,
  { label: string; className: string }
> = {
  confirmed: {
    label: "Confermato",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  },
  declined: {
    label: "Non viene",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  pending: {
    label: "In attesa",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
};

function AdminDashboard() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const {
    rows,
    stats,
    isLoading,
    isError,
    isFetching,
    formatDate,
    handleRefresh,
    handleExportCsv,
    handleCopyInviteLink,
    copiedGuestId,
    logout,
    fileInputRef,
    isUploading,
    uploadProgress,
    uploadError,
    uploadResult,
    handleUploadClick,
    handleFileChange,
  } = useAdminDashboard();

  return (
    <div className="page-enter min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-xl font-bold">
            Dashboard Organizzatori
          </h1>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Esci
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4 text-emerald-600" />
                Confermati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-600">
                {stats.confirmed}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.totalPeople} {stats.totalPeople === 1 ? "persona" : "persone"} in totale
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UserX className="h-4 w-4 text-red-600" />
                Rifiutati
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">
                {stats.declined}
              </p>
              <p className="text-xs text-muted-foreground">
                non partecipano
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4 text-gray-500" />
                In attesa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-gray-500">
                {stats.pending}
              </p>
              <p className="text-xs text-muted-foreground">
                non hanno risposto
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Aggiorna
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Esporta CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload lista invitati
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {isUploading && uploadProgress ? (
          <div className="space-y-2 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Importazione invitati</span>
              <span className="text-muted-foreground">
                {uploadProgress.current} / {uploadProgress.total}
              </span>
            </div>
            <Progress value={uploadProgress.percent} />
            <p className="text-xs text-muted-foreground">
              {uploadProgress.currentName
                ? `Elaborazione: ${uploadProgress.currentName}`
                : "Completamento..."}
            </p>
          </div>
        ) : null}

        {uploadError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {uploadError}
          </div>
        ) : null}

        {uploadResult ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
            Importazione completata: {uploadResult.created}{" "}
            {uploadResult.created === 1 ? "creato" : "creati"},{" "}
            {uploadResult.skipped}{" "}
            {uploadResult.skipped === 1 ? "già presente" : "già presenti"}
            {uploadResult.invalid > 0
              ? `, ${uploadResult.invalid} non validi`
              : ""}
            .
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Errore nel caricamento degli invitati. Riprova.
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            Nessun invitato trovato.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-center">Ospiti</TableHead>
                  <TableHead>Data conferma</TableHead>
                  <TableHead>Copia link invito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const cfg = statusConfig[row.status];
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">
                        {row.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cfg.className}
                        >
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {row.status === "confirmed" ? (
                          <span>
                            {row.totalPeople}{" "}
                            <span className="text-xs text-muted-foreground">
                              {row.totalPeople === 1 ? "persona" : "persone"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(row.confirmedAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto px-2 py-1 text-primary hover:text-primary"
                          onClick={() => handleCopyInviteLink(row.id)}
                        >
                          {copiedGuestId === row.id ? (
                            <>
                              <Check className="mr-1.5 h-3.5 w-3.5" />
                              Copiato!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-1.5 h-3.5 w-3.5" />
                              Copia link
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
