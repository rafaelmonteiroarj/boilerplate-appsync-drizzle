import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(false),
  isAdmin: boolean("is_admin").notNull().default(false),
  password: varchar("password", { length: 256 }).notNull(),
  questionlimitQuota: integer("question_limit_quota").notNull().default(20),
  avatar: varchar("avatar", { length: 256 }).default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
