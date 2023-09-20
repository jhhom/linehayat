import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Numeric = ColumnType<string, string | number, string | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Admins {
  id: Generated<number>;
  username: string;
  password: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface Feedbacks {
  id: Generated<number>;
  volunteerId: number;
  comment: Generated<string>;
  sessionStart: Timestamp;
  sessionEnd: Timestamp;
  rating: Numeric | null;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface KnexMigrations {
  id: Generated<number>;
  name: string | null;
  batch: number | null;
  migrationTime: Timestamp | null;
}

export interface KnexMigrationsLock {
  index: Generated<number>;
  isLocked: number | null;
}

export interface Volunteers {
  id: Generated<number>;
  email: string;
  username: string;
  password: string;
  isApproved: Generated<boolean>;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface DB {
  admins: Admins;
  feedbacks: Feedbacks;
  knexMigrations: KnexMigrations;
  knexMigrationsLock: KnexMigrationsLock;
  volunteers: Volunteers;
}
