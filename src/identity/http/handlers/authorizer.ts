import { AppSyncAuthorizerEvent, AppSyncAuthorizerResult } from "aws-lambda";
import { DomainException } from "../../../shared/core/exeption/domain.exception";
import { AuthorizerUserUseCase } from "../../core/use-cases/authorizer.use-case";

export const handler = async (
  event: AppSyncAuthorizerEvent,
): Promise<AppSyncAuthorizerResult<{ user?: string; message?: string }>> => {
  try {
    const token = event.authorizationToken?.split(" ")[1];

    const authorizerUseCase = new AuthorizerUserUseCase();
    return await authorizerUseCase.execute(token);
  } catch (err) {
    if (err instanceof DomainException) {
      return {
        isAuthorized: false,
        resolverContext: {
          message: err.message,
        },
        deniedFields: [],
        ttlOverride: 0,
      };
    }

    return {
      isAuthorized: false,
      resolverContext: {
        message: `Server error: ${(err as Error).message}`,
      },
      deniedFields: [],
      ttlOverride: 0,
    };
  }
};
