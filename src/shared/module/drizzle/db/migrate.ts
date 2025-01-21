import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

if (!process.env.DATABASE_URL) {
  throw new Error("Invalid environment variable DATABASE_URL");
}

const connection = neon(process.env.DATABASE_URL);
const db = drizzle(connection);

migrate(db, {
  migrationsFolder: "./src/shared/module/drizzle/db/migrations",
}).then(() => {
  console.debug("Migrations applied successfully!");
});
