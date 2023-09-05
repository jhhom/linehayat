import type { Observer } from "@trpc/server/observable";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import ws from "ws";

export type Socket = Observer<SubscriptionMessage, unknown>;

type Session = {
  auth:
    | {
        type: "student";
        studentId: string;
        socket: Socket;
      }
    | {
        type: "volunteer";
        email: string;
        socket: Socket;
      }
    | {
        type: "anonymous";
        socket: Socket;
      }
    | null;
};

type StudentEventPayload = {
  request_accepted: {};
};

type SubscriptionMessage = {
  [k in keyof SubscriptionEventPayload]: {
    event: k;
    payload: SubscriptionEventPayload[k];
  };
}[keyof SubscriptionEventPayload];

type SubscriptionEventPayload = {};

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
