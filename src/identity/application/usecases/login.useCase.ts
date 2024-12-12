import { generateRandomString } from "../../../@common/utils/functions";
import { Session } from "../../domain/entities/session.entity";
import { IUserRepository } from "../../domain/repositories/user.repository";

export class LoginUserUseCase {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async execute(
    email: string,
    password: string,
    origin: string,
  ): Promise<Session> {
    const user = await this.userRepository.getByEmail(email);

    if (!user && origin === "coe") {
      // generate random password
      password = generateRandomString(10);
      await this.userRepository.create({
        name: email.split("@")[0],
        email: email,
        password: password,
        origin: origin,
        grantAccessGenia: new Map<string, boolean>([
          ["coe", true],
          ["trends", false],
        ]),
      });

      return await this.userRepository.loginCoe(email);
    }

    // create signature never expires
    // if (user && user.origin === "coe") {
    //   console.log("create signature never expires");
    // }
    return await this.userRepository.login(email, password);
  }
}
