import { Kysely } from "kysely";
import { DB } from "@backend/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  VolunteerStudentPairs,
  volunteerStudentPairs,
} from "@backend/core/memory";
import type { StudentId } from "@api-contract/types";
import { faker } from "@faker-js/faker";
import { Context, StudentSocket } from "@backend/router/context";
import { DashboardUpdate } from "@api-contract/subscription";
import { AppError } from "@api-contract/errors";
import { JwtPayload } from "jsonwebtoken";
import { jwt } from "@backend/lib/lib";
import { ok, err } from "neverthrow";
import { broadcastToVolunteers } from "@backend/core/memory";
import { latestDashboardUpdate } from "@backend/service/common/dashboard";

export async function makeRequest(
  {
    db,
    onlineStudents,
    onlineVolunteers,
    jwtKey,
  }: {
    db: Kysely<DB>;
    onlineStudents: OnlineStudents;
    onlineVolunteers: OnlineVolunteers;
    volunteerStudentPairs: VolunteerStudentPairs;
    jwtKey: string;
  },
  studentCtx: {
    socket: StudentSocket;
    setAuth: (args: Parameters<Context["setAuth"]>[0]) => void;
  }
) {
  // 1. generate a student username
  const username = randomStudentUsername();

  // 2. add the username to onlineStudent list
  onlineStudents.set(usernameToStudentId(username), studentCtx.socket);

  // 3. send an update to every volunteer
  broadcastToVolunteers(onlineVolunteers, {
    event: "volunteer.dashboard_update",
    payload: latestDashboardUpdate(
      onlineStudents,
      onlineVolunteers,
      volunteerStudentPairs
    ),
  });

  // 4. create a token containing student's username
  const token = jwt.sign({ username: username } as JwtPayload, jwtKey, {
    expiresIn: "10000h",
  });
  if (token.isErr()) {
    return err(new AppError("UNKNOWN", { cause: token.error }));
  }

  studentCtx.setAuth({
    type: "student",
    studentId: usernameToStudentId(username),
    socket: studentCtx.socket,
  });

  return ok({ token: token.value });
}

const usernameToStudentId = (name: string): StudentId => {
  return `st_${name}`;
};

export const randomStudentUsername = () => {
  const idx = faker.number.int({ min: 0, max: animalNames.length });
  // let animalName = randomAnimals[idx]().replace(/ /g, "");
  // let animalName = faker.animal.type();
  let animalName = animalNames[idx];
  // animalName = animalName.charAt(0).toUpperCase() + animalName.slice(1);

  const username =
    faker.word.adverb() +
    // capitalizeFirstLetter(faker.word.verb()) +
    capitalizeFirstLetter(faker.word.adjective()) +
    capitalizeFirstLetter(animalName);

  return username;
};

const capitalizeFirstLetter = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const animalNames = [
  "Elephant",
  "Giraffe",
  "Zebra",
  "Lion",
  "Tiger",
  "Rhino",
  "Hippopotamus",
  "Gorilla",
  "Chimpanzee",
  "Wolf",
  "Fox",
  "Bear",
  "Deer",
  "Moose",
  "Elk",
  "Coyote",
  "Jaguar",
  "Leopard",
  "Cheetah",
  "Hyena",
  "Kangaroo",
  "Koala",
  "Panda",
  "Penguin",
  "Meerkat",
  "Armadillo",
  "Sloth",
  "Otter",
  "Seal",
  "Walrus",
  "Marmoset",
  "Squirrel",
  "Platypus",
  "Lemur",
  "Gibbon",
  "Dolphin",
  "Porcupine",
  "Cobra",
  "Python",
  "Anaconda",
  "Viper",
  "Bison",
  "Buffalo",
  "Impala",
  "Antelope",
  "Wildebeest",
  "Hedgehog",
  "Ferret",
  "Raccoon",
  "Pangolin",
  "Puma",
  "Lynx",
  "Ocelot",
  "Bobcat",
  "Rat",
  "Mouse",
  "Hamster",
  "Bat",
  "Gazelle",
  "Gnu",
  "Peacock",
  "Parrot",
  "Ostrich",
  "Kookaburra",
  "Cockatoo",
  "Macaque",
  "Baboon",
  "Tamarin",
  "Tapir",
  "Llama",
  "Alpaca",
  "Iguana",
  "Chameleon",
  "Gecko",
  "Tortoise",
  "Vulture",
  "Hawk",
  "Eagle",
  "Falcon",
  "Owl",
  "Sparrow",
  "Pigeon",
  "Puffin",
  "Peregrine",
  "Frigatebird",
  "Toucan",
  "Woodpecker",
  "Pelican",
  "Swan",
  "Goose",
  "Duck",
  "Flamingo",
  "Seagull",
  "Crane",
  "Heron",
  "Egret",
  "Peafowl",
  "Kestrel",
  "Sparrowhawk",
  "Stork",
  "Finch",
  "Lark",
  "Nightingale",
  "Raven",
  "Crow",
  "Jay",
  "Magpie",
  "Starling",
  "Robin",
  "Wren",
  "Pika",
  "Mole",
  "Shrew",
  "Badger",
  "Wombat",
  "Echidna",
  "Wallaby",
  "Salamander",
  "Newt",
  "Axolotl",
  "Monitor",
  "Swordfish",
  "Marlin",
  "Tuna",
  "Barracuda",
  "Shark",
  "Hammerhead",
  "Sawfish",
  "Stingray",
  "Manta",
  "Trout",
  "Salmon",
  "Bass",
  "Tilapia",
  "Catfish",
  "Carp",
  "Piranha",
  "Betta",
  "Guppy",
  "Goldfish",
  "Seahorse",
  "Jellyfish",
  "Octopus",
  "Squid",
  "Cuttlefish",
  "Nautilus",
  "Clam",
  "Oyster",
  "Mussel",
  "Snail",
  "Slug",
  "Ant",
  "Bee",
  "Wasp",
  "Hornet",
  "Termite",
  "Cicada",
  "Grasshopper",
  "Cricket",
  "Beetle",
  "Ladybug",
  "Firefly",
  "Butterfly",
  "Moth",
  "Dragonfly",
  "Damselfly",
  "Mosquito",
  "Fly",
  "Flea",
  "Tick",
  "Louse",
  "Centipede",
  "Millipede",
  "Scorpion",
  "Spider",
  "Tarantula",
  "Leech",
  "Lobster",
  "Crab",
  "Shrimp",
  "Prawn",
  "Crayfish",
  "Barnacle",
  "Starfish",
  "SeaUrchin",
  "SeaCucumber",
  "SeaAnemone",
  "Coral",
  "Sponge",
  "Clownfish",
  "Angelfish",
  "Tang",
  "Surgeonfish",
  "SeaLion",
  "Manatee",
  "Dugong",
  "Beluga",
  "Narwhal",
  "Orca",
  "Porpoise",
  "Turtle",
  "Boa",
  "Rattlesnake",
  "GarterSnake",
  "KingCobra",
  "BlackMamba",
  "GreenMamba",
  "TreeSnake",
  "WaterSnake",
  "RatSnake",
  "CornSnake",
  "MilkSnake",
  "CoralSnake",
  "SeaSnake",
  "Cottonmouth",
  "Frog",
  "Toad",
  "Lizard",
  "MonitorLizard",
  "KomodoDragon",
  "GilaMonster",
];
