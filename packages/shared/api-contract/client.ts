import { z } from "zod";

import { contract } from "./endpoints";
import type {
  StudentSubscriptionEventPayload,
  VolunteerSubscriptionEventPayload,
} from "./subscription";

import {
  StudentContract,
  VolunteerContract,
  AdminContract,
  Contract,
} from "./endpoints";
import {
  StudentServiceResult,
  VolunteerServiceResult,
  ServiceResult,
} from "./types";

type IClient = {
  [k in keyof Contract]: Contract[k] extends {
    input: z.ZodSchema;
  }
    ? (arg: z.infer<Contract[k]["input"]>) => ServiceResult<k>
    : () => ServiceResult<k>;
};

export type IAdminClient = {
  [k in keyof AdminContract]: AdminContract[k] extends {
    input: z.ZodSchema;
  }
    ? (arg: z.infer<AdminContract[k]["input"]>) => ServiceResult<k>
    : () => ServiceResult<k>;
};

export type IStudentClient = {
  [k in keyof StudentContract]: StudentContract[k] extends {
    input: z.ZodSchema;
  }
    ? (arg: z.infer<StudentContract[k]["input"]>) => ServiceResult<k>
    : () => StudentServiceResult<k>;
};

export type IVolunteerClient = {
  [k in keyof VolunteerContract]: VolunteerContract[k] extends {
    input: z.ZodSchema;
  }
    ? (arg: z.infer<VolunteerContract[k]["input"]>) => ServiceResult<k>
    : () => VolunteerServiceResult<k>;
};

type ISubscription<
  TEventPayload extends
    | StudentSubscriptionEventPayload
    | VolunteerSubscriptionEventPayload,
> = {
  addListener: <T extends keyof TEventPayload>(
    event: T,
    listener: (payload: TEventPayload[T]) => void
  ) => number;
  removeListener: <T extends keyof TEventPayload>(
    event: T,
    listenerId: number
  ) => void;
  resetListeners: () => void;
};

type IApiClient<
  T extends StudentSubscriptionEventPayload | VolunteerSubscriptionEventPayload,
> = {} & IClient & ISubscription<T>;

export type IStudentApiClient = IApiClient<StudentSubscriptionEventPayload>;

export type IVolunteerApiClient = IApiClient<VolunteerSubscriptionEventPayload>;
