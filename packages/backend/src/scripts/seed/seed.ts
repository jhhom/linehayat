import { DB } from "@backend/core/schema";
import pg from "pg";
import { CamelCasePlugin, PostgresDialect, Kysely } from "kysely";
import { loadConfig } from "@backend/config/config";

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

const seed = async () => {
  await db
    .insertInto("volunteers")
    .values({
      username: "james",
      password: "james123",
      email: "james@email.com",
      isApproved: true,
    })
    .execute();

  await db
    .insertInto("admins")
    .values({
      username: "admin",
      password: "admin123",
    })
    .execute();
};

seed();
