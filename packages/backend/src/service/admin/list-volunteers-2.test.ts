import { CamelCasePlugin, PostgresDialect, Kysely, Insertable } from "kysely";
import { expect, test, describe } from "vitest";
import pg from "pg";
import { loadConfig } from "@backend/config/config";
import { sqrt } from "@backend/utils/math";
import {
  paginationMeta,
  paginationToLimitOffsetPointer,
} from "@backend/utils/pagination";
import { DB, Volunteers } from "@backend/core/schema";
import { seed } from "@backend/test-utils/seed";
import { listVolunteers2 } from "@backend/service/admin/list-volunteers-2.service";

// Test naming: https://markus.oberlehner.net/blog/naming-your-unit-tests-it-should-vs-given-when-then/
// Test naming: https://twitter.com/housecor/status/1703407970648780882

const Pool = pg.Pool;

const config = loadConfig();
if (config.isErr()) {
  throw config.error;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: "postgres://postgres@localhost:5432/linehayat_test",
  }),
});

const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (event.level === "query") {
      // console.log(event.query.sql);
      // console.log(event.query.parameters);
    }
  },
  plugins: [new CamelCasePlugin()],
});

describe("Pagination", () => {
  test("Should filter correctly", async () => {
    await db.deleteFrom("volunteers").execute();
    await db.insertInto("volunteers").values(seedData).execute();

    {
      const result = (await listVolunteers2({ db }, {}))._unsafeUnwrap();
      expect(result.results.length).toBe(seedData.length);
    }

    {
      const result = (
        await listVolunteers2(
          { db },
          {
            filter: {
              username: "le",
            },
            pagination: {
              pageSize: 10,
              pageNumber: 1,
            },
          }
        )
      )._unsafeUnwrap();
      expect(result.results.length).toBe(3);
      expect(result.pagination?.totalItems).toBe(3);
    }

    {
      const result = (
        await listVolunteers2(
          { db },
          {
            filter: {
              username: "le",
            },
            pagination: {
              pageSize: 1,
              pageNumber: 2,
            },
          }
        )
      )._unsafeUnwrap();
      expect(result.results.length).toBe(1);
      expect(result.pagination?.totalItems).toBe(3);
    }

    {
      const result = (
        await listVolunteers2(
          { db },
          {
            filter: {
              isApproved: true,
            },
            pagination: {
              pageSize: 2,
              pageNumber: 3,
            },
          }
        )
      )._unsafeUnwrap();
      expect(result.results.length).toBe(2);
      expect(result.pagination?.totalItems).toBe(10);
    }
  });
});

const seedData: Insertable<Volunteers>[] = [
  {
    email: "Korbin.Langosh@email.com",
    username: "Korbin.Langosh",
    password: "Korbin.Langosh123",
    isApproved: true,
  },
  {
    email: "Candelario_Simonis91@email.com",
    username: "Candelario_Simonis91",
    password: "Candelario_Simonis91123",
    isApproved: false,
  },
  {
    email: "Lesley.Pacocha@email.com",
    username: "Lesley.Pacocha",
    password: "Lesley.Pacocha123",
    isApproved: true,
  },
  {
    email: "Lester99@email.com",
    username: "Lester99",
    password: "Lester99123",
    isApproved: false,
  },
  {
    email: "Imelda_Feil7@email.com",
    username: "Imelda_Feil7",
    password: "Imelda_Feil7123",
    isApproved: true,
  },
  {
    email: "Lavon.Kovacek16@email.com",
    username: "Lavon.Kovacek16",
    password: "Lavon.Kovacek16123",
    isApproved: false,
  },
  {
    email: "Twila37@email.com",
    username: "Twila37",
    password: "Twila37123",
    isApproved: true,
  },
  {
    email: "Brooklyn_Mueller24@email.com",
    username: "Brooklyn_Mueller24",
    password: "Brooklyn_Mueller24123",
    isApproved: true,
  },
  {
    email: "Beatrice60@email.com",
    username: "Beatrice60",
    password: "Beatrice60123",
    isApproved: false,
  },
  {
    email: "Raphael_Rohan@email.com",
    username: "Raphael_Rohan",
    password: "Raphael_Rohan123",
    isApproved: false,
  },
  {
    email: "Rosina10@email.com",
    username: "Rosina10",
    password: "Rosina10123",
    isApproved: true,
  },
  {
    email: "Madonna_Dach39@email.com",
    username: "Madonna_Dach39",
    password: "Madonna_Dach39123",
    isApproved: true,
  },
  {
    email: "Tad57@email.com",
    username: "Tad57",
    password: "Tad57123",
    isApproved: false,
  },
  {
    email: "Quentin_Nolan29@email.com",
    username: "Quentin_Nolan29",
    password: "Quentin_Nolan29123",
    isApproved: false,
  },
  {
    email: "Anibal_Mohr@email.com",
    username: "Anibal_Mohr",
    password: "Anibal_Mohr123",
    isApproved: true,
  },
  {
    email: "Brigitte.Kling46@email.com",
    username: "Brigitte.Kling46",
    password: "Brigitte.Kling46123",
    isApproved: false,
  },
  {
    email: "Elmore.Hilll-Moen43@email.com",
    username: "Elmore.Hilll-Moen43",
    password: "Elmore.Hilll-Moen43123",
    isApproved: false,
  },
  {
    email: "Jeff_McDermott@email.com",
    username: "Jeff_McDermott",
    password: "Jeff_McDermott123",
    isApproved: false,
  },
  {
    email: "Nathanael_Jerde94@email.com",
    username: "Nathanael_Jerde94",
    password: "Nathanael_Jerde94123",
    isApproved: true,
  },
  {
    email: "Vern25@email.com",
    username: "Vern25",
    password: "Vern25123",
    isApproved: true,
  },
];
