import { expect, test, describe } from "vitest";
import { sqrt } from "@backend/utils/math";
import {
  paginationMeta,
  paginationToLimitOffsetPointer,
} from "@backend/utils/pagination";

// Test naming: https://markus.oberlehner.net/blog/naming-your-unit-tests-it-should-vs-given-when-then/
// Test naming: https://twitter.com/housecor/status/1703407970648780882

describe("Pagination", () => {
  test("Should calculate the correct SQL limit and offset", () => {
    const pointer = paginationToLimitOffsetPointer({
      pageSize: 10,
      pageNumber: 2,
    });
    expect(pointer.limit).toBe(10);
    expect(pointer.offset).toBe(10);
  });

  test("Should provide the correct metadata", () => {
    const meta = paginationMeta({
      totalItems: 35,
      pageSize: 10,
      pageNumber: 4,
    });
    expect(meta.pageSize).toBe(10);
    expect(meta.pageNumber).toBe(4);
    expect(meta.totalItems).toBe(35);
    expect(meta.totalPages).toBe(4);
  });
});
