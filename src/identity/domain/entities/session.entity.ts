import { User } from "./user.entity";

export interface Session {
  token: string;
  user: User;
}
