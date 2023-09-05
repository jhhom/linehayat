import { expect, test } from "vitest";
import { sqrt } from "~/utils/math";

test("Math.sqrt()", () => {
  expect(sqrt(4)).toBe(2);
  expect(Math.sqrt(144)).toBe(12);
  expect(Math.sqrt(2)).toBe(Math.SQRT2);
});
