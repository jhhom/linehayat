import type { Observer } from "@trpc/server/observable";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import ws from "ws";



type Session = {
  auth: AuthAnonymous | AuthStudent | AuthVolunteer | null;
};

type StudentEventPayload = {
  request_accepted: {};
};

type StudentSubscriptionMessage = {
  [k in keyof StudentEventPayload]: {
    event: k;
    payload: StudentEventPayload[k];
  };
}[keyof StudentEventPayload];

type VolunteerEventPayload = {
  dashboard_update: {};
};

type VolunteerSubscriptionMessage = {
  [k in keyof VolunteerEventPayload]: {
    event: k;
    payload: VolunteerEventPayload[k];
  };
}[keyof VolunteerEventPayload];

// when registering socket, we set the ctx.session.auth = authAnonymous
// with socket of any
type AuthAnonymous = {
  // socket
  socket: Observer<any, unknown>;
  type: "anonymous";
};

// after student request to chat, we set the ctx.session.auth = AuthStudent{
//  socket: ctx.socket
// }
// on the front-end, Client will changes to StudentClient, and will drop all existing listeners and allow user to register listener to student message
type AuthStudent = {
  socket: Observer<StudentSubscriptionMessage, unknown>;
  studentId: string;
  type: "student";
};

// after volunteer login, we set the ctx.session.auth = AuthStudent{
//  socket: ctx.socket
// }
// on the front-end, Client will changes to VolunteerClient, and will drop all existing listeners and allow user to register listener to student message
type AuthVolunteer = {
  socket: Observer<VolunteerSubscriptionMessage, unknown>;
  email: string;
  type: "volunteer";
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

export type IServiceStudentContext = {
  auth: Extract<Session["auth"], { auth: AuthStudent }>;
};

export type IServiceVolunteerContext = {
  auth: Extract<Session["auth"], { auth: AuthVolunteer }>;
};

export type IServiceAnonymousContext = {
  auth: Extract<Session["auth"], { auth: AuthAnonymous }>;
};
