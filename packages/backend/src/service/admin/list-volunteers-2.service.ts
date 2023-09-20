import type { ServiceInput, ServiceResult } from "@api-contract/types";
import { ok, err } from "neverthrow";
import { AppError } from "@api-contract/errors";
import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import { fromPromise } from "neverthrow";
import {
  paginationMeta,
  paginationToLimitOffsetPointer,
} from "@backend/utils/pagination";

export async function listVolunteers2(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"admin/list_volunteers2">
): ServiceResult<"admin/list_volunteers2"> {
  let query = db.selectFrom("volunteers").selectAll().orderBy("username");

  let countQuery = db
    .selectFrom("volunteers")
    .select(({ fn }) => fn.count<string>("volunteers.id").as("volunteerCount"));

  if (arg.filter) {
    if (arg.filter.isApproved !== undefined) {
      query = query.where("isApproved", "=", arg.filter.isApproved);
      countQuery = countQuery.where("isApproved", "=", arg.filter.isApproved);
    }
    if (arg.filter.username !== undefined) {
      query = query.where("username", "ilike", `%${arg.filter.username}%`);
      countQuery = countQuery.where(
        "username",
        "ilike",
        `%${arg.filter.username}%`
      );
    }
  }

  const countResult = await fromPromise(
    countQuery.executeTakeFirstOrThrow(),
    (e) => e
  );
  if (countResult.isErr()) {
    return err(new AppError("DATABASE", { cause: countResult.error }));
  }
  const totalItems = Number.parseInt(countResult.value.volunteerCount);
  const totalPages = Math.ceil(
    totalItems / (arg.pagination?.pageSize ?? 10_000)
  );
  const pagination = arg.pagination
    ? arg.pagination
    : {
        pageSize: 10_000,
        pageNumber: 1,
      };

  if (pagination.pageNumber > totalPages) {
    pagination.pageNumber = totalPages;
  }

  const pointer = paginationToLimitOffsetPointer(pagination);
  query = query.limit(pointer.limit).offset(pointer.offset);

  const r = await fromPromise(query.execute(), (e) => e);
  if (r.isErr()) {
    return err(new AppError("DATABASE", { cause: r.error }));
  }
  return ok({
    results: r.value,
    pagination: paginationMeta({
      totalItems,
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
    }),
  });
}
