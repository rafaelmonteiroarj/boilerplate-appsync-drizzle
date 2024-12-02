import { Redis } from "ioredis";
import dotenv from "dotenv";
import { DynamoRepository } from "../dynamodb/UserRepository";
import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { CustomJwtPayload } from "../adapter/types";
import { User } from "../../domain/entities/user.entity";
import { IRedisRepository } from "../../domain/repositories/redis.repository";

dotenv.config();

class RedisRepository implements IRedisRepository {
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
      } catch (error) {
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
  async getUserDynamodb(email: string): Promise<User | null> {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );
    const user = await userRepository.getByEmail(email);

    return user;
  }

  async checkUserQuestionQuota(
    userJwt: CustomJwtPayload,
  ): Promise<{ isAuthorized: boolean; validationMessage?: string }> {
    if (userJwt.isAdmin) {
      return { isAuthorized: true };
    }

    const key = `question_limit_quota${userJwt.id}`;
    const EXPIRATION_TIME = Number(process.env.EXPIRATION_TIME);

    try {
      const user = await this.getUserDynamodb(userJwt.email);

      // check exists user in DB
      if (!user) {
        throw new ValidationRequestError("Usuário não encontrado.");
      }

      await this.connect();

      const rdCurrentQuota = await this.get(key);

      // if user equal 0 is ilimited
      if (rdCurrentQuota && Number(rdCurrentQuota) === 0) {
        return {
          isAuthorized: true,
        };
      }

      // Check current quota user daily
      if (rdCurrentQuota && Number(rdCurrentQuota) >= user.questionlimitQuota) {
        return {
          isAuthorized: false,
          validationMessage:
            `Cota diária excedida. Você atingiu o limite de ${user.questionlimitQuota} perguntas. ` +
            `Aguarde e tente novamente, mas tarde.`,
        };
      }

      const currentQuota = await this._conn!.incr(key);

      if (currentQuota === 1) {
        await this._conn!.expire(key, EXPIRATION_TIME);
      }

      console.debug(
        `Nova chave criada no Redis: ${key} com valor: 1 e expiração de ${EXPIRATION_TIME} segundos`,
      );

      const ttl = await this.ttl(key);

      console.debug(`TTL remanescente para a chave ${key}: ${ttl} segundos`);

      return { isAuthorized: true };
    } catch (error) {
      if (error instanceof Error) {
        throw new ValidationRequestError(error.message);
      }
      throw error;
    } finally {
      this.close();
    }
  }

  async deleteByPattern(pattern: string): Promise<boolean> {
    try {
      console.log(`Deletando chaves com o padrão ${pattern}`);
      let cursor = "0";
      await this.connect();

      if (!this._conn) throw new Error("Redis connection not established.");

      do {
        // SCAN para buscar chaves com o padrão
        const [nextCursor, keys] = await this._conn!.scan(
          cursor,
          "MATCH",
          pattern,
          "COUNT",
          100,
        );
        cursor = nextCursor;
        console.log(`Cursor: ${cursor}`);
        console.log(`Chaves encontradas: ${keys.length}`);
        if (keys.length > 0) {
          console.log(`Encontradas: ${keys}`);
          // Deletar as chaves
          await this._conn!.del(...keys);
          console.log(`Deletadas: ${keys}`);
        }
      } while (cursor !== "0");
      return true;
    } catch (error) {
      throw error;
    } finally {
      this.close();
    }
  }
}

export default RedisRepository;
