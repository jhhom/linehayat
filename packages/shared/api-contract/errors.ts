import { type z } from "zod";

export type ErrorPayload = {
  REQUEST_VALIDATION: {
    issues: z.ZodIssue[];
  };
  RESOURCE_NOT_FOUND: {
    resource: string;
  };
  DATABASE: {
    cause: unknown;
  };
  UNKNOWN: {
    cause: unknown;
    info?: unknown;
  };
  SAVE_MEDIA_FAILED: { media: string; cause: unknown };
  "AUTH.INCORRECT_PASSWORD": undefined;
  "AUTH.VOLUNTEER_NOT_YET_APPROVED": undefined;
  "DB.DUPLICATE_COLUMN": { column: string };
};

export const ErrorMessage: { [k in keyof ErrorPayload]: string } = {
  REQUEST_VALIDATION: "Invalid request",
  RESOURCE_NOT_FOUND: "Requested resource is not found",
  DATABASE: "An error has occured from database operation",
  UNKNOWN: "An unexpected error has occured",
  SAVE_MEDIA_FAILED: "Failed to save media",
  "AUTH.INCORRECT_PASSWORD": "Incorrect password",
  "AUTH.VOLUNTEER_NOT_YET_APPROVED": "Volunteer has not been approved",
  "DB.DUPLICATE_COLUMN": "Unique column has duplicate value",
};

export class AppError<T extends keyof ErrorPayload> extends Error {
  readonly details: {
    type: T;
    info: ErrorPayload[T];
  };
  readonly message: string;
  constructor(type: T, info: ErrorPayload[T]) {
    super();
    this.details = {
      type,
      info,
    };
    this.message = ErrorMessage[type];
  }
}

export const isAppError = (e: unknown): e is AppErrorUnion => {
  const assertedE = e as AppErrorUnion;
  return (
    assertedE.details !== undefined &&
    typeof assertedE.details === "object" &&
    typeof assertedE.message === "string" &&
    assertedE.details.type in Object.keys(ErrorMessage)
  );
};

export type AppErrorUnion = {
  [K in keyof ErrorPayload]: AppError<K>;
}[keyof ErrorPayload];
