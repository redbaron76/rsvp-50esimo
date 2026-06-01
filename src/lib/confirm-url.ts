import { env } from "@/env";

export const buildConfirmUrl = (guestId: string): string => {
  const base = env.VITE_BASE_URL.replace(/\/$/, "");
  return `${base}/confirm/${guestId}`;
};
