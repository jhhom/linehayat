import { expect, test } from "vitest";
import { parse } from "date-fns";
import { moreThan45MinutesAgo } from "@backend/core/memory";

test("Duration calculation", () => {
  {
    const d = parse("2023-09-23 22:25", "yyyy-MM-dd HH:mm", new Date());
    const ago = moreThan45MinutesAgo(d, new Date());
    expect(ago).toBeFalsy();
  }

  {
    const d = parse("2023-09-23 21:30", "yyyy-MM-dd HH:mm", new Date());
    const ago = moreThan45MinutesAgo(d, new Date());
    expect(ago).toBeTruthy();
  }
});
