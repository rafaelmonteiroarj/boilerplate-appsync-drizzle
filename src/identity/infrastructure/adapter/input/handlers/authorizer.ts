import { verify } from "jsonwebtoken";
import { AppSyncAuthorizerEvent, CustomJwtPayload } from "../../types";
import { checkOperation } from "./middlewares/get-operation";

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
    const response = await handler(event);

    if (
      event.requestHeaders?.origin ===
      "https://geniax.poc.coedigital.clarobrasil.mobi"
    ) {
      return response;
    } else {
      const token = event.authorizationToken?.split(" ")[1];

      if (!token) {
        throw new Error("Token não encontrado");
      }

      const user = verify(
        token,
        `${process.env.JWT_SECRET}`,
      ) as CustomJwtPayload;

      const operationName = extractOperationName(
        event.requestContext.queryString,
      );

      await checkOperation(user, operationName);
    }

    return response;
  };
};

export const handler = withPostHandlerMiddleware(lambdaHandler);
