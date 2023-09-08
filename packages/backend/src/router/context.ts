import type { Observer } from "@trpc/server/observable";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";

import ws from "ws";

import type {
  VolunteerSubscriptionMessage,
  StudentSubscriptionMessage,
} from "@api-contract/subscription";
import { StudentId } from "~/core/memory";

export type StudentSocket = Observer<StudentSubscriptionMessage, unknown>;

export type VolunteerSocket = Observer<VolunteerSubscriptionMessage, unknown>;

type Session = {
  auth:
    | {
        type: "student";
        // studentId = null: means student is not having any identity yet
        // studentId will be `null` in situations where:
        // - student have call `student/register_socket`, but haven't call either
        //    - student/make_request
        //    - student/associate_session
        studentId: StudentId | null;
        socket: StudentSocket;
      }
    | {
        type: "volunteer";
        username: string | null;
        socket: VolunteerSocket;
      }
    | null;
};

export class Context {
  readonly session: Session;

  constructor() {
    this.session = {
      auth: null,
    };
  }

  get auth() {
    return this.session.auth;
  }

  setAuth(sessionAuth: Session["auth"]) {
    this.session.auth = sessionAuth;
  }
}

export const createContextInner = (
  opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  return {
    opts,
    ctx: new Context(),
  };
};

export const createContextBuilder = () => {
  const createContext = (
    opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
  ) => {
    return createContextInner(opts);
  };
  return createContext;
};

export type IContext = inferAsyncReturnType<
  ReturnType<typeof createContextBuilder>
>;

export type IServiceContext = Context;
