import Redis from "ioredis";
import { CustomJwtPayload } from "../../infrastructure/adapter/types";
import { User } from "../entities/user.entity";

export interface IRedisRepository {
  connect(): Redis;
  close(): void;
  delete(key: string): Promise<number>;
  get(key: string): Promise<string | null>;
  set(
    key: string,
    value: string,
    expirationMode?: "EX",
    timeInSeconds?: number,
  ): Promise<string>;
  ttl(key: string): Promise<number>;
  getUserDynamodb(email: string): Promise<User | null>;
  checkUserQuestionQuota(
    userJwt: CustomJwtPayload,
  ): Promise<{ isAuthorized: boolean; validationMessage?: string }>;
}
