import {
  createTRPCProxyClient,
  wsLink,
  createWSClient,
  httpBatchLink,
} from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import type { AppRouter } from "../../../backend/src/router";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    wsLink<AppRouter>({
      client: createWSClient({
        url: "ws://localhost:5001/trpc",
      }),
    }),
  ],
});

export default trpc;
