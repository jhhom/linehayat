import superjson from "superjson";
import { wsLink, createWSClient, createTRPCProxyClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { fromPromise, ok, err } from "neverthrow";

import { AppError, type AppErrorUnion } from "@api-contract/errors";
import type { Unsubscribable } from "@trpc/server/observable";
import type {
  StudentSubscriptionEventPayload,
  VolunteerSubscriptionEventPayload,
} from "@api-contract/subscription";

import type { IVolunteerClient } from "@api-contract/client";
import type { IAppRouter } from "@backend/router/router";

import { config } from "@config/config";

import { RouterError } from "@backend/router/error-formatter";
import { ServiceInput, ServiceSyncResult } from "@api-contract/types";
import { IAppVolunteerRouter } from "@backend/router/router-volunteer";

export class Client implements IVolunteerClient {
  #trpc: ReturnType<typeof createTRPCProxyClient<IAppVolunteerRouter>>;
  #subscription: Unsubscribable | undefined;
  #socketListeners: {
    [k in keyof VolunteerSubscriptionEventPayload]: Map<
      number,
      (arg: VolunteerSubscriptionEventPayload[k]) => void
    >;
  };

  constructor() {
    this.#trpc = createTRPCProxyClient<IAppVolunteerRouter>({
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
            url: config.SERVER_URL,
          }),
        }),
      ],
    });
    this.#socketListeners = {
      "volunteer.dashboard_update": new Map(),
      "volunteer.student_disconnected": new Map(),
      "volunteer.message": new Map(),
      "volunteer.hanged_up": new Map(),
      "volunteer.student_typing": new Map(),
    };
  }

  addListener<T extends keyof VolunteerSubscriptionEventPayload>(
    event: T,
    listener: (payload: VolunteerSubscriptionEventPayload[T]) => void,
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
        "Number of listeners exceeded maximum numer of listeners, which is 100",
      );
    }

    return uniqueRandomInt;
  }

  removeListener(
    event: keyof VolunteerSubscriptionEventPayload,
    listenerId: number,
  ) {
    this.#socketListeners[event].delete(listenerId);
  }

  #runListener<T extends keyof VolunteerSubscriptionEventPayload>(
    event: T,
    payload: VolunteerSubscriptionEventPayload[T],
  ) {
    for (const listener of this.#socketListeners[event].values()) {
      listener(payload);
    }
  }

  #fromApiPromise<T>(promise: Promise<T>) {
    return fromPromise(promise, (e) => e as RouterError).mapErr(
      (e) =>
        new AppError(e.data.details.type, e.data.details.info) as AppErrorUnion,
    );
  }

  async ["volunteer/accept_request"](
    arg: ServiceInput<"volunteer/accept_request">,
  ) {
    const r = await this.#fromApiPromise(
      this.#trpc["volunteer/accept_request"].mutate(arg),
    );
    return r;
  }

  async ["volunteer/send_message"](
    arg: ServiceInput<"volunteer/send_message">,
  ) {
    const r = await this.#fromApiPromise(
      this.#trpc["volunteer/send_message"].mutate(arg),
    );
    return r;
  }

  async ["volunteer/hang_up"]() {
    const r = await this.#fromApiPromise(
      this.#trpc["volunteer/hang_up"].mutate(),
    );
    return r;
  }

  async ["volunteer/sign_up"](arg: ServiceInput<"volunteer/sign_up">) {
    const r = await this.#fromApiPromise(
      this.#trpc["volunteer/sign_up"].mutate(arg),
    );
    return r;
  }

  async ["volunteer/typing"](arg: ServiceInput<"volunteer/typing">) {
    const r = await this.#fromApiPromise(
      this.#trpc["volunteer/typing"].mutate(arg),
    );
    return r;
  }

  async ["volunteer/login"](arg: ServiceInput<"volunteer/login">) {
    if (this.#subscription !== undefined) {
      this.#subscription.unsubscribe();
    }

    return new Promise<ServiceSyncResult<"volunteer/login">>((resolve) => {
      this.#trpc["volunteer/register_socket"].subscribe(undefined, {
        onStarted: async () => {
          const r = await this.#fromApiPromise(
            this.#trpc["volunteer/login"].mutate(arg),
          );
          if (r.isErr()) {
            resolve(err(r.error));
            return;
          }
          resolve(ok(r.value));
        },
        onData: (d) => {
          this.#runListener(d.event, d.payload);
        },
        onComplete: () => {
          this.#subscription = undefined;
        },
        onError: (e) => {
          const newE: RouterError = e as unknown as RouterError;
          if (newE.data) {
            resolve(
              err(
                new AppError(
                  newE.data.details.type,
                  newE.data.details.info,
                ) as AppErrorUnion,
              ),
            );
          } else {
            resolve(err(new AppError("UNKNOWN", { cause: newE })));
          }
        },
      });
    });
  }
}

export const client = new Client();
