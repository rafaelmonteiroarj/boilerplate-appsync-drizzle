import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";

import { IRedisRepository } from "../../domain/repositories/redis.repository";
import { IUserRepository } from "../../domain/repositories/user.repository";

import { UserQuotaDTO } from "../dtos/user-quota.dto";
import { UserQuota } from "../../domain/entities/user-quota.entity";
export class GetUserQuotaUseCase {
  private userRepository: IUserRepository;
  private redisRepository: IRedisRepository;

  constructor(
    userRepository: IUserRepository,
    redisRepository: IRedisRepository,
  ) {
    this.userRepository = userRepository;
    this.redisRepository = redisRepository;
  }

  async execute({ sessionUserEmail }: UserQuotaDTO): Promise<UserQuota> {
    const sessionUser = await this.userRepository.getByEmail(sessionUserEmail);

    if (!sessionUser?.active) {
      throw new ValidationRequestError(
        "Seu usuário não está ativo. Por favor, entre em contato com o administrador.",
      );
    }

    if (!sessionUser) {
      throw new ValidationRequestError("Usuário não encontrado.");
    }

    const key = `question_limit_quota${sessionUser.id}`;
    this.redisRepository.connect();

    const userQuota = await this.redisRepository.get(key);

    // if (!userQuota) {
    //   throw new ValidationRequestError(
    //     "Nenhuma cota de perguntas encontrada para esse usuário",
    //   );
    // }
    const quota = userQuota ? Number(userQuota) : 0;

    const response: UserQuota = {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      isAdmin: sessionUser.isAdmin,
      questionlimitQuota: sessionUser.questionlimitQuota,
      remainingQuota: sessionUser.questionlimitQuota - Number(quota),
      usedQuota: Number(quota),
    };

    return response;
  }
}
