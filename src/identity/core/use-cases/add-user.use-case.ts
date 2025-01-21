import { DomainException } from "../../../shared/core/exeption/domain.exception";
import { CreateUserDTO } from "../../http/handlers/dtos/create-user.dto";
import { UserRepository } from "../../persistence/repository/user.repository";
import { UserModel } from "../model/user.model";

export class AddUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserModel> {
    const checkIsUser = await this.userRepository.getByEmail(data.email);
    if (checkIsUser) {
      throw new DomainException("Já existe um usuário com este e-mail.");
    }

    const createdUser = await this.userRepository.create(data);
    if (!createdUser) {
      throw new Error("Não foi possível cadastrar o usuário.");
    }

    return createdUser;
  }
}
