import { UserDto } from "../../application/dtos/UserDto";
import { Session } from "../entities/Session";
import { User } from "../entities/User";

export interface IUserRepository {
  list(): Promise<User[]>;
  create(user: UserDto): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  login(email: string, password: string): Promise<Session>;
}
