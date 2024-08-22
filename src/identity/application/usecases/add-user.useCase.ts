import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";
import { UserDto } from "../dtos/user.dto";

export class AddUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(user: UserDto): Promise<User> {
    const checkIsUser = await this.userRepository.getByEmail(user.email);
    if (checkIsUser) {
      throw new ValidationRequestError("Usuário já cadastrado.");
    } else {
      return await this.userRepository.create(user);
    }
  }
}
