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

export async function listFeedbacks(
  {
    db,
  }: {
    db: Kysely<DB>;
  },
  arg: ServiceInput<"admin/list_feedbacks">
): ServiceResult<"admin/list_feedbacks"> {
  let query = db
    .selectFrom("feedbacks")
    .innerJoin("volunteers", "feedbacks.volunteerId", "volunteers.id")
    .select([
      'feedbacks.id as feedbackId',
      "volunteers.username as volunteerUsername",
      "volunteers.id as volunteerId",
      "feedbacks.sessionStart",
      "feedbacks.sessionEnd",
      "feedbacks.rating",
      "feedbacks.comment",
    ]);

  let countQuery = db
    .selectFrom("feedbacks")
    .innerJoin("volunteers", "feedbacks.volunteerId", "volunteers.id")
    .select(({ fn }) => fn.count<string>("feedbacks.id").as("feedbacksCount"));

  if (arg.filter) {
    if (arg.filter.username !== null) {
      query = query.where(
        "volunteers.username",
        "ilike",
        `%${arg.filter.username}%`
      );
      countQuery = countQuery.where(
        "volunteers.username",
        "ilike",
        `%${arg.filter.username}%`
      );
    }
    if (arg.filter.from) {
      query = query.where("feedbacks.sessionStart", ">=", arg.filter.from);
      countQuery = countQuery.where(
        "feedbacks.sessionStart",
        ">=",
        arg.filter.from
      );
    }
    if (arg.filter.to) {
      query = query.where("feedbacks.sessionEnd", "<=", arg.filter.to);
      countQuery = countQuery.where(
        "feedbacks.sessionEnd",
        "<=",
        arg.filter.to
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
  const totalItems = Number.parseInt(countResult.value.feedbacksCount);
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

  const r = (await fromPromise(query.execute(), (e) => e)).map((v) => {
    return v.map((x) => ({
      ...x,
      rating: x.rating ? Number.parseFloat(x.rating) : undefined,
    }));
  });
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
