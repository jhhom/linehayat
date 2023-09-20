import { DB } from "@backend/core/schema";
import { Kysely, Insertable } from "kysely";
import type { Volunteers } from "@backend/core/schema";
import { faker } from "@faker-js/faker";

export const seed = async (db: Kysely<DB>) => {
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
  const volunteers: Insertable<Volunteers>[] = [...Array(20).keys()].map(() =>
    newVolunteer(faker.internet.userName(), faker.datatype.boolean())
  );
  console.log(volunteers);
  await db.insertInto("volunteers").values(volunteers).execute();

  return {
    volunteers,
  };
};
