import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export const Route = createFileRoute("/admin/")({
  component: AdminIndex,
});

function AdminIndex() {
  const { isAuthenticated } = useAdminAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/admin/login" />;
}
