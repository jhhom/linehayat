import { expect, test } from "vitest";
import { sqrt } from "~/utils/math";
import { faker } from "@faker-js/faker";

test("random student name", () => {
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

  const idx = faker.number.int({ min: 0, max: randomAnimals.length });
  let animalName = randomAnimals[idx]().replace(/ /g, "");
  // let animalName = faker.animal.type();
  animalName = animalName.charAt(0).toUpperCase() + animalName.slice(1);

  const username =
    // faker.word.adverb() +
    // faker.word.verb() +
    faker.word.adjective() + animalName;

  console.log(username);
});
