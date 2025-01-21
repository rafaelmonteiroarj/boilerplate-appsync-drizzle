import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

const configureWebSocket = () => {
  if (!globalThis.WebSocket) {
    (globalThis as any).WebSocket = ws;
  }
};

const createPool = (databaseUrl: string) => {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL não está definida");
  }

  return new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });
};

export const createDrizzleInstance = (databaseUrl: string) => {
  configureWebSocket();
  const pool = createPool(databaseUrl);
  return drizzle(pool);
};

export const db = process.env.DATABASE_URL
  ? createDrizzleInstance(process.env.DATABASE_URL)
  : null;

export const getDrizzleInstance = (): ReturnType<
  typeof createDrizzleInstance
> => {
  let drizzleInstance: ReturnType<typeof createDrizzleInstance> | null = null;

  if (!drizzleInstance) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("A URL do banco de dados não está configurada.");
    }
    drizzleInstance = createDrizzleInstance(databaseUrl);
  }
  return drizzleInstance;
};
