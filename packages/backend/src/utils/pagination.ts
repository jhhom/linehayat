import type { Pagination, PaginationMeta } from "@api-contract/endpoints";

export const paginationToLimitOffsetPointer = (pagination: Pagination) => {
  const offset = (pagination.pageNumber - 1) * pagination.pageSize;
  return {
    limit: pagination.pageSize,
    offset: offset < 0 ? 0 : offset,
  };
};

export const paginationMeta = (arg: {
  totalItems: number;
  pageSize: number;
  pageNumber: number;
}): PaginationMeta => {
  return {
    pageNumber: arg.pageNumber,
    pageSize: arg.pageSize,
    totalItems: arg.totalItems,
    totalPages: Math.ceil(arg.totalItems / arg.pageSize),
  };
};
