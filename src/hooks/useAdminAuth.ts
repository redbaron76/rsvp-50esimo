import { useCallback, useState, useSyncExternalStore } from "react";

import { pb } from "@/lib/pb";

const authStoreSubscribe = (callback: () => void) => {
  return pb.authStore.onChange(callback);
};

const getIsAuthenticated = () => pb.authStore.isValid;

export const useAdminAuth = () => {
  const isAuthenticated = useSyncExternalStore(
    authStoreSubscribe,
    getIsAuthenticated,
    () => false,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await pb
        .collection("birth_admin_users")
        .authWithPassword(email, password);
    } catch {
      setError("Email o password non corretti");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  return { isAuthenticated, isLoading, error, login, logout };
};
