import { z } from "zod";

import { contract } from "./endpoints";
import { ServiceResult } from "./types";
import type { SubscriptionEventPayload } from "./subscription";

type IClient = {
  [k in keyof typeof contract]: (typeof contract)[k] extends {
    input: z.ZodSchema;
  }
    ? (arg: z.infer<(typeof contract)[k]["input"]>) => ServiceResult<k>
    : () => ServiceResult<k>;
};

type ISubscription = {
  addListener: <T extends keyof SubscriptionEventPayload>(
    event: T,
    listener: (payload: SubscriptionEventPayload[T]) => void
  ) => number;
  removeListener: <T extends keyof SubscriptionEventPayload>(
    event: T,
    listenerId: number
  ) => void;
  resetListeners: () => void;
};

export type IApiClient = {} & IClient & ISubscription;
