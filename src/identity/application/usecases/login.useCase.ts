import { Session } from "../../domain/entities/session.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";

export class LoginUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(email: string, password: string): Promise<Session> {
    return await this.userRepository.login(email, password);
  }

  async executeByAD(email: string, name: string): Promise<Session> {
    return await this.userRepository.loginByAD(email, name);
  }
}
