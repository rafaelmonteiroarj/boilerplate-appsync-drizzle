import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";

import { IUserRepository } from "../../domain/repositories/user.repository";

import { IScheduleQuotaRepository } from "../../domain/repositories/schedule-quota.repository";
import { ScheduleQuotaDTO } from "../dtos/schedule-quota.dto";
import { ScheduleQuota } from "../../domain/entities/schedule-quota.entity";
import { timeToCron } from "../../../@common/utils/functions";
export class UpdateScheduleQuotaUseCase {
  private scheduleQuotaRepository: IScheduleQuotaRepository;
  private userRepository: IUserRepository;
  constructor(
    scheduleQuotaRepository: IScheduleQuotaRepository,
    userRepository: IUserRepository,
  ) {
    this.scheduleQuotaRepository = scheduleQuotaRepository;
    this.userRepository = userRepository;
  }

  async execute({
    sessionUserEmail,
    hours,
  }: ScheduleQuotaDTO): Promise<ScheduleQuota> {
    const sessionUser = await this.userRepository.getByEmail(sessionUserEmail);

    if (!sessionUser?.active) {
      throw new ValidationRequestError(
        "Seu usuário não está ativo. Por favor, entre em contato com o administrador.",
      );
    }

    if (!sessionUser?.isAdmin) {
      throw new ValidationRequestError(
        "O usuário não possui permissão suficiente para realizar essa operação",
      );
    }

    // transform string to cron
    const cronExpression = timeToCron(hours);
    console.log(`transforming hours:${hours} to cron: ${cronExpression}`);
    const result =
      await this.scheduleQuotaRepository.scheduleQuota(cronExpression);

    console.log(result);

    const response: ScheduleQuota = {
      message: ` ScheduleQuota updated successfully - Every day at Hours: ${hours}`,
    };
    return response;
  }
}
