import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export const useLoginForm = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, login } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/admin/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await login(value.email, value.password);
    },
  });

  return { form, isLoading, error, isAuthenticated };
};
