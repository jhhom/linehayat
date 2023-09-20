import {
  createTRPCProxyClient,
  wsLink,
  createWSClient,
  httpBatchLink,
} from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import type { IAppAdminRouter } from "@backend/router/router-admin";

const trpc = createTRPCProxyClient<IAppAdminRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (process.env.NODE_ENV === "development" &&
          typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    wsLink<IAppAdminRouter>({
      client: createWSClient({
        url: "ws://localhost:4001/trpc",
      }),
    }),
  ],
});

export default trpc;
