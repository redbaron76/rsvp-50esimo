import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {},

  clientPrefix: "VITE_",

  client: {
    VITE_BASE_URL: z.url(),
    VITE_API_BASE_URL: z.url(),
    VITE_API_ACCESS_TOKEN: z.string().min(1),
    VITE_ADMIN_PATH: z.string().min(1).optional(),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
