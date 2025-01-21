import { sign } from "jsonwebtoken";
import { DomainException } from "../../../shared/core/exeption/domain.exception";
import { LoginByAdDTO, LoginDTO } from "../../http/handlers/dtos/login.dto";
import { UserRepository } from "../../persistence/repository/user.repository";
import { UserModel } from "../model/user.model";

export class LoginUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: LoginDTO): Promise<{ token: string; user: UserModel }> {
    const user = await this.userRepository.getByEmail(data.email);

    if (!user) {
      throw new DomainException("Email ou senha inválidos.");
    }

    if (
      UserModel.decryptPassword(user.password, process.env.JWT_SECRET!) !==
      data.password
    ) {
      throw new DomainException("Email ou senha inválidos.");
    }

    if (!user.isActive) {
      throw new DomainException(
        "Usuário inativo. Entre em contato com o Administrador.",
      );
    }

    const token = sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
    );

    return { token, user };
  }

  async executeByAD(
    data: LoginByAdDTO,
  ): Promise<{ token: string; user: UserModel }> {
    const checkUser = await this.userRepository.getByEmail(data.email);
    let user: UserModel;

    if (!checkUser) {
      const createdUser = await this.userRepository.create({
        email: data.email,
        name: data.name,
        isActive: true,
        password: UserModel.encryptPassword(
          data.email,
          process.env.JWT_SECRET!,
        ),
      });

      if (!createdUser) {
        throw new Error("Não foi possível cadastrar o usuário.");
      }

      user = createdUser;
    } else {
      if (!checkUser.isActive) {
        throw new DomainException(
          "Usuário inativo. Entre em contato com o Administrador.",
        );
      }

      user = checkUser;
    }

    const token = sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30m" },
    );

    return { token, user };
  }
}
