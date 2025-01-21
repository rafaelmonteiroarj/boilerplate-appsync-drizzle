import { UserRepository } from "../../persistence/repository/user.repository";
import { UserModel } from "../model/user.model";

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page: number, limit: number): Promise<UserModel[]> {
    return await this.userRepository.findAll(page, limit);
  }
}
