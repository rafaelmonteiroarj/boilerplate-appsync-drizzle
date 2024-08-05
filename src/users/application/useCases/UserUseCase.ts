import { ValidationRequestError } from "../../../@common/errors/ValidationRequestError";
import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserDto } from "../dtos/UserDto";

export class UserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async list(): Promise<User[]> {
    return await this.userRepository.list();
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userRepository.getByEmail(email);
  }

  async create(user: UserDto): Promise<User> {
    const checkIsUser = await this.getByEmail(user.email);
    if (checkIsUser) {
      throw new ValidationRequestError("Usuário já cadastrado.");
    } else {
      return await this.userRepository.create(user);
    }
  }
}
