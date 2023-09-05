import superjson from "superjson";

import { wsLink, createWSClient, createTRPCProxyClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { fromPromise, ok, err } from "neverthrow";
import { inferRouterError } from "@trpc/server";

import type { IAppRouter } from "@backend/backend/router2/router";
import { IApiClient } from "@api-contract/client";

import { Unsubscribable } from "@trpc/server/observable";
import { SubscriptionEventPayload } from "@api-contract/subscription";
import { ServiceInput, ServiceSyncResult } from "@api-contract/types";

type RouterError = inferRouterError<IAppRouter>;

export class Client implements IApiClient {
  #trpc: ReturnType<typeof createTRPCProxyClient<IAppRouter>>;
  #subscription: Unsubscribable | undefined;
  #socketListeners: {
    [k in keyof SubscriptionEventPayload]: Map<
      number,
      (arg: SubscriptionEventPayload[k]) => void
    >;
  };

  constructor() {
    this.#trpc = createTRPCProxyClient<IAppRouter>({
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === "development" &&
              typeof window !== "undefined") ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        wsLink<IAppRouter>({
          client: createWSClient({
            url: "ws://localhost:4001",
          }),
        }),
      ],
    });
    this.#socketListeners = {
      "student.request_accepted": new Map(),
    };
  }

  #fromApiPromise<T>(promise: Promise<T>) {
    return fromPromise(promise, (e) => e);
  }

  addListener<T extends keyof SubscriptionEventPayload>(
    event: T,
    listener: (payload: SubscriptionEventPayload[T]) => void
  ) {
    const min = Math.ceil(1);
    const max = Math.floor(10_000);
    let uniqueRandomInt = Math.floor(Math.random() * (max - min + 1)) + min;

    while (this.#socketListeners[event].has(uniqueRandomInt)) {
      uniqueRandomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    }

    this.#socketListeners[event].set(uniqueRandomInt, listener);

    if (this.#socketListeners[event].size > 100) {
      throw new Error(
        "Number of listeners exceeded maximum numer of listeners, which is 100"
      );
    }

    return uniqueRandomInt;
  }

  resetListeners() {
    this.#socketListeners = {
      "student.request_accepted": new Map(),
    };
  }

  #runListener<T extends keyof SubscriptionEventPayload>(
    event: T,
    payload: SubscriptionEventPayload[T]
  ) {
    for (const listener of this.#socketListeners[event].values()) {
      listener(payload);
    }
  }

  removeListener(event: keyof SubscriptionEventPayload, listenerId: number) {
    this.#socketListeners[event].delete(listenerId);
  }

  async ["volunteer/login"](arg: ServiceInput<"volunteer/login">) {
    return new Promise<ServiceSyncResult<"volunteer/login">>((resolve) =>
      this.#trpc["register_socket"].subscribe(undefined, {
        onStarted: async () => {
          const r = await this.#fromApiPromise(
            this.#trpc["volunteer/login"].mutate(arg)
          );
          if (r.isErr()) {
            resolve(err(r.error));
            return;
          }
          resolve(ok(r.value));
        },
      })
    );
  }
}

export const client: IApiClient = new Client();
