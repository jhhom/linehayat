import superjson from "superjson";
import { wsLink, createWSClient, createTRPCProxyClient } from "@trpc/client";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { fromPromise, ok, err } from "neverthrow";

import { AppError, type AppErrorUnion } from "@api-contract/errors";
import type { Unsubscribable } from "@trpc/server/observable";

import type { IAppRouter } from "@backend/router/router";

import { config } from "@config/config";

import { RouterError } from "@backend/router/error-formatter";
import { ServiceInput, ServiceSyncResult } from "@api-contract/types";
import { IAppAdminRouter } from "@backend/router/router-admin";
import { IAdminClient } from "@api-contract/client";

export class Client implements IAdminClient {
  #trpc: ReturnType<typeof createTRPCProxyClient<IAppAdminRouter>>;
  #subscription: Unsubscribable | undefined;

  constructor() {
    this.#trpc = createTRPCProxyClient<IAppAdminRouter>({
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
  }

  #fromApiPromise<T>(promise: Promise<T>) {
    return fromPromise(promise, (e) => e as RouterError).mapErr(
      (e) =>
        new AppError(e.data.details.type, e.data.details.info) as AppErrorUnion,
    );
  }

  async ["admin/login"](arg: ServiceInput<"admin/login">) {
    const r = await this.#fromApiPromise(this.#trpc["admin/login"].mutate(arg));
    return r;
  }

  async ["admin/list_volunteers"]() {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/list_volunteers"].query(),
    );
    return r;
  }

  async ["admin/list_volunteers2"](
    arg: ServiceInput<"admin/list_volunteers2">,
  ) {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/list_volunteers2"].query(arg),
    );
    return r;
  }

  async ["admin/list_feedbacks"](arg: ServiceInput<"admin/list_feedbacks">) {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/list_feedbacks"].query(arg),
    );
    return r;
  }

  async ["admin/delete_volunteer"](
    arg: ServiceInput<"admin/delete_volunteer">,
  ) {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/delete_volunteer"].mutate(arg),
    );
    return r;
  }

  async ["admin/delete_feedback"](arg: ServiceInput<"admin/delete_feedback">) {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/delete_feedback"].mutate(arg),
    );
    return r;
  }

  async ["admin/edit_volunteer_status"](
    arg: ServiceInput<"admin/edit_volunteer_status">,
  ) {
    const r = await this.#fromApiPromise(
      this.#trpc["admin/edit_volunteer_status"].mutate(arg),
    );
    return r;
  }
}

export const client = new Client();
