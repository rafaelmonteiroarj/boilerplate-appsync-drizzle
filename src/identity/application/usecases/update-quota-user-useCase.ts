import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UpdateQuotaUserDTO } from "../dtos/update-quota-user";

export class UpdateQuotaUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    userEmail,
    questionlimitQuota,
  }: UpdateQuotaUserDTO): Promise<User> {
    const sessionUser = await this.userRepository.getByEmail(userEmail);

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

    return await this.userRepository.updateQuota(userEmail, questionlimitQuota);
  }
}
