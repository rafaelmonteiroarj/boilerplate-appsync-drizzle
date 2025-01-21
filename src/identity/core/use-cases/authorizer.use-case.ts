import { AppSyncAuthorizerResult } from "aws-lambda";
import { verify } from "jsonwebtoken";

import { DomainException } from "../../../shared/core/exeption/domain.exception";
import { UserModel } from "../model/user.model";

export class AuthorizerUserUseCase {
  async execute(
    token: string,
  ): Promise<AppSyncAuthorizerResult<{ user?: string; message?: string }>> {
    if (!token) {
      throw new DomainException("Token não encontrado.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new DomainException("JWT_SECRET não encontrada.");
    }

    const decoded = verify(token, jwtSecret) as UserModel;
    if (!decoded) {
      throw new DomainException("Token inválido.");
    }

    return {
      isAuthorized: true,
      resolverContext: { user: JSON.stringify(decoded) },
      deniedFields: [],
      ttlOverride: 300,
    };
  }
}
