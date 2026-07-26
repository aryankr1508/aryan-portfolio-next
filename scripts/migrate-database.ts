import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run database migrations");
}

const database = drizzle({ client: neon(databaseUrl) });

await migrate(database, {
  migrationsFolder: "./drizzle"
});

console.log("Portfolio database migrations completed.");
