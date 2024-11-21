import { verify } from "jsonwebtoken";
import { AppSyncAuthorizerEvent, CustomJwtPayload } from "../../types";
import { checkOperation } from "./middlewares/get-operation";
import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";

const extractOperationName = (queryString: string): string => {
  const cleanQuery = queryString.replace(/\s+/g, " ").trim();
  const match = cleanQuery.match(
    /(?:mutation|query)\s+\(\$.*?\)\s*{\s*([a-zA-Z0-9_]+)/,
  );

  if (match && match[1]) {
    return match[1];
  }

  const fallbackMatch = cleanQuery.match(/{[\s\n]*([a-zA-Z0-9_]+)/);
  return fallbackMatch ? fallbackMatch[1] : "";
};

const lambdaHandler = async (): Promise<{
  isAuthorized: boolean;
  resolverContext: object;
  deniedFields: string[];
  ttlOverride: number;
  validationMessage?: string;
}> => {
  return {
    isAuthorized: true,
    resolverContext: {},
    deniedFields: [],
    ttlOverride: 0,
  };
};

export const withPostHandlerMiddleware = (
  handler: (event: AppSyncAuthorizerEvent) => Promise<any>,
) => {
  return async (event: AppSyncAuthorizerEvent): Promise<any> => {
    try {
      const response = await handler(event);

      if (event.requestHeaders?.origin === process.env.URI_GENIA_COE) {
        return response;
      }

      const token = event.authorizationToken?.split(" ")[1];
      if (!token) {
        throw new ValidationRequestError("Token não encontrado");
      }

      const user = verify(
        token,
        `${process.env.JWT_SECRET}`,
      ) as CustomJwtPayload;

      const operationName = extractOperationName(
        event.requestContext.queryString,
      );

      const checkOperationResult = await checkOperation(user, operationName);

      if (checkOperationResult && !checkOperationResult.isAuthorized) {
        return {
          isAuthorized: false,
          resolverContext: {
            message:
              checkOperationResult.validationMessage || "Unauthorized access",
          },
          deniedFields: [],
          ttlOverride: 0,
        };
      }

      return response;
    } catch (error) {
      if (error instanceof ValidationRequestError) {
        return {
          isAuthorized: false,
          resolverContext: {
            message: `Validation error: ${error.message}`,
          },
          deniedFields: [],
          ttlOverride: 0,
        };
      } else {
        throw error;
      }
    }
  };
};

export const handler = withPostHandlerMiddleware(lambdaHandler);
