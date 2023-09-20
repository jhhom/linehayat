import { DB, Feedbacks, Volunteers } from "@backend/core/schema";
import pg from "pg";
import { CamelCasePlugin, PostgresDialect, Kysely, Insertable } from "kysely";
import { loadConfig } from "@backend/config/config";
import { faker } from "@faker-js/faker";
import { addHours } from "date-fns";

const Pool = pg.Pool;

const config = loadConfig();
if (config.isErr()) {
  throw config.error;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: config.value.DATABASE_URL,
  }),
});

const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (event.level === "query") {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
  plugins: [new CamelCasePlugin()],
});

const newRandomFeedback = (
  availableVolunteerIds: number[]
): Insertable<Feedbacks> => {
  if (availableVolunteerIds.length === 0) {
    throw new Error("No volunteer available");
  }

  const idx = faker.number.int({ min: 0, max: availableVolunteerIds.length });
  const volunteerId = availableVolunteerIds[idx];
  const possibleRatings = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  const rating =
    possibleRatings[faker.number.int({ min: 0, max: possibleRatings.length })];
  const comment = faker.lorem.sentences({ min: 1, max: 5 });
  const sessionStart = faker.date.recent({ days: 20 });
  const sessionEnd = addHours(
    sessionStart,
    faker.number.int({ min: 0, max: 3 })
  );

  return {
    volunteerId,
    comment,
    sessionStart,
    sessionEnd,
    rating,
  };
};

const seedFeedbacks = async (numToSeed: number) => {
  const volunteerIds = (
    await db.selectFrom("volunteers").select("id").execute()
  ).map((x) => x.id);

  const seed: Insertable<Feedbacks>[] = [...Array(numToSeed).keys()].map(() =>
    newRandomFeedback(volunteerIds)
  );

  await db.insertInto("feedbacks").values(seed).execute();
};

seedFeedbacks(20);
