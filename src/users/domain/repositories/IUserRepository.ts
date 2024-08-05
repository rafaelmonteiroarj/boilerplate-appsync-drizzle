import { UserDto } from "../../application/dtos/UserDto";
import { User } from "../entities/User";

export interface IUserRepository {
  list(): Promise<User[]>;
  create(user: UserDto): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
}
