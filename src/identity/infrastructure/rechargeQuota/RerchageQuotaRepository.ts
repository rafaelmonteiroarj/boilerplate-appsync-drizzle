import { IRechargeQuotaRepository } from "../../domain/repositories/recharge-quota.repository";
import RedisRepository from "../redis/RedisRepository";
class RechargeQuotaRepository implements IRechargeQuotaRepository {
  constructor() {}
  async recharge(): Promise<string> {
    const redisRepository = new RedisRepository();

    redisRepository.connect();
    await redisRepository.deleteByPattern("question_limit_quota*");

    return "Recharge Quota";
  }
}

export { RechargeQuotaRepository };
