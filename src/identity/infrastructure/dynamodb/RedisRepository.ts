import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

class RedisRepository {
  private _conn: Redis | null = null;

  connect(): Redis {
    if (!this._conn) {
      const host = process.env.REDIS_HOST || "localhost";
      const port = parseInt(process.env.REDIS_PORT || "6379", 10);

      try {
        this._conn = new Redis({
          host,
          port,
        });
        console.info(
          `Successfully connected to Redis with host=${host}, port=${port}.`,
        );
      } catch (error) {
        console.error(`Error connecting to Redis: ${error}`);
        throw error;
      }
    }

    return this._conn;
  }

  close(): void {
    if (this._conn) {
      this._conn.disconnect();
      this._conn = null;
    }
  }

  async delete(key: string): Promise<number> {
    if (!this._conn) throw new Error("Redis connection not established.");
    return await this._conn.del(key);
  }

  async get(key: string): Promise<string | null> {
    if (!this._conn) throw new Error("Redis connection not established.");
    return await this._conn.get(key);
  }

  async set(key: string, value: string): Promise<string> {
    if (!this._conn) throw new Error("Redis connection not established.");
    return await this._conn.set(key, value);
  }
}

export default RedisRepository;
