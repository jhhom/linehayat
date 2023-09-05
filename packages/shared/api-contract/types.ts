import type { Contract } from "./endpoints";
import { Result } from "neverthrow";
import { z } from "zod";
import { AppErrorUnion } from "./errors";

export type ServiceResult<T extends keyof Contract> = Promise<
  Result<z.infer<Contract[T]["output"]>, AppErrorUnion>
>;

export type ServiceSyncResult<T extends keyof Contract> = Result<
  z.infer<Contract[T]["output"]>,
  AppErrorUnion
>;

export type ServiceOutput<T extends keyof Contract> = z.infer<
  Contract[T]["output"]
>;

export type ServiceInput<T extends keyof Contract> = Contract[T] extends {
  input: z.ZodSchema;
}
  ? z.infer<Contract[T]["input"]>
  : never;