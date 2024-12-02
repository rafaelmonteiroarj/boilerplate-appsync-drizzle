import { IRechargeQuotaRepository } from "../../domain/repositories/recharge-quota.repository";

export class RechargeQuotaUseCase {
  private rechargeQuotaRepository: IRechargeQuotaRepository;
  // private userRepository: IUserRepository;

  constructor(
    rechargeQuotaRepository: IRechargeQuotaRepository,
    // userRepository: IUserRepository,
  ) {
    this.rechargeQuotaRepository = rechargeQuotaRepository;
    // this.userRepository = userRepository;
  }

  async execute(): Promise<string> {
    console.log("RechargeQuotaUseCase");
    // const sessionUser = await this.userRepository.getByEmail(sessionUserEmail);

    // if (!sessionUser?.active) {
    //   throw new ValidationRequestError(
    //     "Seu usuário não está ativo. Por favor, entre em contato com o administrador.",
    //   );
    // }

    // if (!sessionUser?.isAdmin) {
    //   throw new ValidationRequestError(
    //     "O usuário não possui permissão suficiente para realizar essa operação",
    //   );
    // }

    return await this.rechargeQuotaRepository.recharge();
  }
}
