import { Kysely } from "kysely";
import { DB } from "~/core/schema";
import {
  OnlineStudents,
  OnlineVolunteers,
  StudentId,
  VolunteerId,
  VolunteerStudentPairs,
  volunteerStudentPairs,
} from "~/core/memory";
import { faker } from "@faker-js/faker";
import { StudentSocket } from "~/router/context";
import { DashboardUpdate } from "@api-contract/subscription";
import { AppError } from "@api-contract/errors";
import { JwtPayload } from "jsonwebtoken";
import { jwt } from "~/lib/lib";
import { ok, err } from "neverthrow";

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
  socket: StudentSocket
) {
  // 1. generate a student username
  const username = randomStudentUsername();

  // 2. add the username to onlineStudent list
  onlineStudents.set(usernameToStudentId(username), socket);

  // 3. send an update to every volunteer
  const update = latestDashboardUpdate(
    onlineStudents,
    onlineVolunteers,
    volunteerStudentPairs
  );

  onlineVolunteers.forEach((s) => {
    s.next({ event: "volunteer.dashboard_update", payload: update });
  });

  // 4. create a token containing student's username
  const token = jwt.sign({ username: username } as JwtPayload, jwtKey, {
    expiresIn: "10000h",
  });
  if (token.isErr()) {
    return err(new AppError("UNKNOWN", { cause: token.error }));
  }

  return ok({ token: token.value });
}

const latestDashboardUpdate = (
  students: OnlineStudents,
  volunteers: OnlineVolunteers,
  volunteerStudentPairs: VolunteerStudentPairs
): DashboardUpdate => {
  // get all volunteers
  // get all volunteers not in pairs -> not busy
  // get all volunteers in pairs -> busy

  // pending requests -> students that are not in pairs
  const freeVolunteers = Array.from(volunteers.keys())
    .filter((vId) => !volunteerStudentPairs.has(vId))
    .map<DashboardUpdate["onlineVolunteers"][number]>((v) => ({
      volunteerId: v,
      status: { status: "free" },
    }));
  const busyVolunteers = Array.from(volunteerStudentPairs.keys());

  const onlineVolunteers = freeVolunteers;
  for (const v of busyVolunteers) {
    const chattingWith = volunteerStudentPairs.get(v);
    if (!chattingWith) {
      continue;
    }
    onlineVolunteers.push({
      volunteerId: v,
      status: {
        status: "busy",
        chattingWith,
      },
    });
  }

  const pairedStudents = new Set(volunteerStudentPairs.values());
  const pendingRequests = Array.from(students.keys())
    .filter((sId) => !pairedStudents.has(sId))
    .map<DashboardUpdate["pendingRequests"][number]>((r) => ({
      studentId: r,
    }));

  return {
    onlineVolunteers,
    pendingRequests,
  };
};

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
