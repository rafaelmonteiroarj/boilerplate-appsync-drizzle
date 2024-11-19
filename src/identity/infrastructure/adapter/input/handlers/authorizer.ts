import { verify, JwtPayload } from "jsonwebtoken";
import RedisRepository from "../../../dynamodb/RedisRepository";

interface AppSyncAuthorizerEvent {
  authorizationToken?: string;
  requestHeaders?: Record<string, string>;
  requestContext: {
    apiId: string;
    accountId: string;
    requestId: string;
    queryString: string;
    variables?: Record<string, any>;
  };
  identity?: {
    sourceIp: string[];
    defaultAuthStrategy: string;
    claims?: Record<string, any>;
  };
}

interface CustomJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isAdmin: boolean;
  questionlimitQuota: number;
  createdAt: string;
  updatedAt: string;
}

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

class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExceededError";
  }
}

const handleRedisOperation = async (
  redisRepo: RedisRepository,
  userId: string,
  questionlimitQuota: number,
) => {
  const client = redisRepo.connect();
  const key = `qustion_limit_quota_${userId}`;
  const EXPIRATION_TIME = 24 * 60 * 60;

  try {
    let redisValue = await client.get(key);
    console.debug(`Valor obtido do Redis para a chave '${key}': ${redisValue}`);

    if (!redisValue) {
      redisValue = "1";
      await client.set(key, redisValue, "EX", EXPIRATION_TIME);
      console.debug(
        `Nova chave criada no Redis: ${key} com valor: ${redisValue} e expiração de ${EXPIRATION_TIME} segundos`,
      );
    } else {
      console.debug(`Valor atual da chave ${key}: ${redisValue}`);
      console.debug(`Limite de perguntas diárias: ${questionlimitQuota}`);
      const currentQuota = parseInt(redisValue, 10);
      if (currentQuota >= questionlimitQuota) {
        const ttl = await client.ttl(key);
        const hoursRemaining = Math.ceil(ttl / 3600);
        throw new QuotaExceededError(
          `Quota diária excedida. Você atingiu o limite de ${questionlimitQuota} perguntas. ` +
            `Aguarde ${hoursRemaining} horas para fazer novas perguntas.`,
        );
      }

      const newValue = (currentQuota + 1).toString();
      await client.set(key, newValue, "EX", EXPIRATION_TIME);
      redisValue = newValue;
    }

    const ttl = await client.ttl(key);
    console.debug(`TTL remanescente para a chave ${key}: ${ttl} segundos`);

    return {
      isAuthorized: true,
      resolverContext: {
        redisValue,
        userId,
        keyTTL: ttl,
        currentQuota: parseInt(redisValue, 10),
        maxQuota: questionlimitQuota,
      },
      deniedFields: [],
      ttlOverride: 0,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Quota excedida para usuário ${userId}: ${error.message}`);
      throw new Error(error.message);
    }
    console.error(`Erro ao manipular Redis: ${error}`);
    throw error;
  } finally {
    redisRepo.close();
  }
};

export const handler = async (event: AppSyncAuthorizerEvent) => {
  const redisRepo = new RedisRepository();

  try {
    const token = event.authorizationToken?.split(" ")[1];

    if (!token) {
      throw new Error("Token não encontrado");
    }

    const decodedToken = verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as CustomJwtPayload;

    console.debug(`decodedToken: ${JSON.stringify(decodedToken)}`);

    const operationName = extractOperationName(
      event.requestContext.queryString,
    );

    console.debug(`event: ${JSON.stringify(event)}`);
    console.debug(`Nome da operação: ${operationName}`);

    if (operationName === "getAnswers") {
      return await handleRedisOperation(redisRepo, decodedToken.id, 100);
    }

    return {
      isAuthorized: true,
      resolverContext: {
        userId: decodedToken.id,
      },
      deniedFields: [],
      ttlOverride: 0,
    };
  } catch (err) {
    console.error("Erro: ", err);
    throw new Error(err instanceof Error ? err.message : "Unauthorized");
  }
};
