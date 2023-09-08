import { Kysely } from "kysely";
import { DB } from "~/core/schema";
import { OnlineStudents, OnlineVolunteers } from "~/core/memory";
import { faker } from "@faker-js/faker";

const randomAnimals = [
  faker.animal.bear,
  faker.animal.bird,
  faker.animal.cat,
  faker.animal.cetacean,
  faker.animal.cow,
  faker.animal.crocodilia,
  faker.animal.dog,
  faker.animal.fish,
  faker.animal.horse,
  faker.animal.insect,
  faker.animal.lion,
  faker.animal.rabbit,
  faker.animal.rodent,
  faker.animal.snake,
];

export async function makeRequest({
  db,
  onlineStudents,
  onlineVolunteers,
  jwtKey,
}: {
  db: Kysely<DB>;
  onlineStudents: OnlineStudents;
  onlineVolunteers: OnlineVolunteers;
  jwtKey: string;
}) {
  // 1. generate a student username
  const idx = faker.number.int({ min: 0, max: randomAnimals.length });
  const animalName = randomAnimals[idx]().toUpperCase().replace(/ /g, "");

  const username = faker.word.adjective() + animalName;
  // 2. add the username to onlineStudent list
  // 3. send an update to every volunteer
  // 4. create a token containing student's username
}
