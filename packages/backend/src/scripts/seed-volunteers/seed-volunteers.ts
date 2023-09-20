import { DB, Volunteers } from "@backend/core/schema";
import pg from "pg";
import { CamelCasePlugin, PostgresDialect, Kysely, Insertable } from "kysely";
import { loadConfig } from "@backend/config/config";
import { faker } from "@faker-js/faker";

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

const newVolunteer = (
  name: string,
  isApproved: boolean
): Insertable<Volunteers> => {
  return {
    email: `${name}@email.com`,
    username: name,
    password: `${name}123`,
    isApproved,
  };
};
const seed: Insertable<Volunteers>[] = [...Array(40).keys()].map(() =>
  newVolunteer(faker.internet.userName(), faker.datatype.boolean())
);

db.insertInto("volunteers").values(seed).execute();
