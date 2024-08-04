import { UserRepository } from "../domain/repositories/UserRepository";
import { User } from "../domain/models/User";

export class GetUsersUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }
}
