import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { ActivateUserDTO } from "../dtos/active-user.dto";

export class ActivateUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    sessionUserEmail,
    userEmailToUpdate,
    isActive,
  }: ActivateUserDTO): Promise<User> {
    const sessionUser = await this.userRepository.getByEmail(sessionUserEmail);

    if (!sessionUser?.isAdmin) {
      throw new ValidationRequestError(
        "O usuário não possui permissão suficiente para realizar essa operação",
      );
    }

    return await this.userRepository.update(userEmailToUpdate, isActive);
  }
}
