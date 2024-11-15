import { UserDto } from "../../application/dtos/user.dto";
import { Session } from "../entities/session.entity";
import { User } from "../entities/user.entity";

export interface IUserRepository {
  list(): Promise<User[]>;
  create(user: UserDto): Promise<User>;
  getByEmail(email: string): Promise<User | null>;
  login(email: string, password: string): Promise<Session>;
  updateActive(userEmailToUpdate: string, isActive: boolean): Promise<User>;
  updateQuota(
    userEmailToUpdate: string,
    questionlimitQuota: number,
  ): Promise<User>;
}
