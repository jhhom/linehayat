import { expect, test } from "vitest";

import { randomStudentUsername } from "~/service/student/make-request.service";

test("random student name", () => {
  const username = randomStudentUsername();

  console.log(username);
});
