import { Redis } from "ioredis";
import dotenv from "dotenv";

import { DynamoRepository } from "../dynamodb/UserRepository";

dotenv.config();

interface CustomJwtPayload {
  id: string;
  email: string;
  questionlimitQuota: number;
}

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

  async set(
    key: string,
    value: string,
    expirationMode?: "EX",
    timeInSeconds?: number,
  ): Promise<string> {
    if (!this._conn) throw new Error("Redis connection not established.");
    if (expirationMode && timeInSeconds) {
      return await this._conn.set(key, value, expirationMode, timeInSeconds);
    }
    return await this._conn.set(key, value);
  }

  async ttl(key: string): Promise<number> {
    if (!this._conn) throw new Error("Redis connection not established.");
    return await this._conn.ttl(key);
  }

  async checkUserQuestionQuota(userJwt: CustomJwtPayload): Promise<void> {
    const key = `question_limit_quota${userJwt.id}`;
    const EXPIRATION_TIME = Number(process.env.EXPIRATION_TIME);

    try {
      const userRepository = new DynamoRepository(
        `${process.env.DYNAMODB_TABLE}`,
      );
      await this.connect();

      const redisValue = await this.get(key);
      const user = await userRepository.getByEmail(userJwt.email);

      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      if (!redisValue) {
        await this.set(key, "1");
        await this._conn!.expire(key, EXPIRATION_TIME);
        console.debug(
          `Nova chave criada no Redis: ${key} com valor: 1 e expiração de ${EXPIRATION_TIME} segundos`,
        );
      } else {
        const currentQuota = await this._conn!.incr(key);

        if (currentQuota === 1) {
          await this._conn!.expire(key, EXPIRATION_TIME);
        }

        console.debug(`Valor atual da chave ${key}: ${currentQuota}`);
        console.debug(
          `Limite de perguntas diárias: ${user.questionlimitQuota}`,
        );

        if (currentQuota > user.questionlimitQuota) {
          // const ttl = await this.ttl(key);
          // const minutesRemaining = Math.ceil(ttl / 60);
          throw new Error(
            `Cota diária excedida. Você atingiu o limite de ${user.questionlimitQuota} perguntas. ` +
              `Aguarde e tente novamente, mas tarde.`,
          );
        }
      }

      const ttl = await this.ttl(key);
      console.debug(`TTL remanescente para a chave ${key}: ${ttl} segundos`);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    } finally {
      this.close();
    }
  }
}

export default RedisRepository;
