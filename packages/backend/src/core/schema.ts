import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

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
  knexMigrations: KnexMigrations;
  knexMigrationsLock: KnexMigrationsLock;
  volunteers: Volunteers;
}
