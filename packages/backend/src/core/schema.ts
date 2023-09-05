import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Volunteers {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  updatedAt: Generated<Timestamp>;
  createdAt: Generated<Timestamp>;
}

export interface DB {
  volunteers: Volunteers;
}
