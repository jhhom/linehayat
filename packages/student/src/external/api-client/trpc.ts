import superjson from "superjson";
import { wsLink, createWSClient, createTRPCProxyClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { fromPromise, ok, err } from "neverthrow";

import { AppError, type AppErrorUnion } from "@api-contract/errors";
import type { Unsubscribable } from "@trpc/server/observable";
import type { StudentSubscriptionEventPayload } from "@api-contract/subscription";

import type { IStudentClient } from "@api-contract/client";
import type { IAppStudentRouter } from "@backend/router/router-student";
import type { IAppRouter } from "@backend/router/router";

import { config } from "@config/config";

import { RouterError } from "@backend/router/error-formatter";
import { ServiceSyncResult, ServiceInput } from "@api-contract/types";

export class Client implements IStudentClient {
  #trpc: ReturnType<typeof createTRPCProxyClient<IAppStudentRouter>>;
  #subscription: Unsubscribable | undefined;
  #socketListeners: {
    [k in keyof StudentSubscriptionEventPayload]: Map<
      number,
      (arg: StudentSubscriptionEventPayload[k]) => void
    >;
  };

  constructor() {
    this.#trpc = createTRPCProxyClient<IAppStudentRouter>({
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
      "student.request_accepted": new Map(),
      "student.volunteer_disconnected": new Map(),
      "student.message": new Map(),
      "student.hanged_up": new Map(),
    };
  }

  addListener<T extends keyof StudentSubscriptionEventPayload>(
    event: T,
    listener: (payload: StudentSubscriptionEventPayload[T]) => void,
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
    event: keyof StudentSubscriptionEventPayload,
    listenerId: number,
  ) {
    this.#socketListeners[event].delete(listenerId);
  }

  #runListener<T extends keyof StudentSubscriptionEventPayload>(
    event: T,
    payload: StudentSubscriptionEventPayload[T],
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

  async ["student/send_message"](arg: ServiceInput<"student/send_message">) {
    const r = await this.#fromApiPromise(
      this.#trpc["student/send_message"].mutate(arg),
    );
    return r;
  }

  async ["student/hang_up"]() {
    const r = await this.#fromApiPromise(
      this.#trpc["student/hang_up"].mutate(),
    );
    return r;
  }

  async ["student/make_request"]() {
    if (this.#subscription !== undefined) {
      this.#subscription.unsubscribe();
    }

    return new Promise<ServiceSyncResult<"student/make_request">>((resolve) => {
      this.#trpc["student/register_socket"].subscribe(undefined, {
        onStarted: async () => {
          const r = await this.#fromApiPromise(
            this.#trpc["student/make_request"].mutate(),
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
