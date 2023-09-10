import type { Contract, StudentContract, VolunteerContract } from "./endpoints";
import { Result } from "neverthrow";
import { z } from "zod";
import { AppErrorUnion } from "./errors";

import { Apply } from "fp-ts/Apply";

export type ServiceResult<T extends keyof Contract> = Promise<
  Result<z.infer<Contract[T]["output"]>, AppErrorUnion>
>;

export type StudentServiceResult<T extends keyof StudentContract> = Promise<
  Result<z.infer<StudentContract[T]["output"]>, AppErrorUnion>
>;

export type VolunteerServiceResult<T extends keyof VolunteerContract> = Promise<
  Result<z.infer<VolunteerContract[T]["output"]>, AppErrorUnion>
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

export const zStudentId = z.custom<`st_${string}`>((val) => {
  return (val as string).startsWith(`st_`);
});

export const zVolunteerId = z.custom<`vl_${string}`>((val) => {
  return (val as string).startsWith(`vl_`);
});

export type StudentId = `st_${string}`;

// VolunteerId should be `vl_` followed by volunteer's username in the database
// e.g `vl_pineapple`
export type VolunteerId = `vl_${string}`;
