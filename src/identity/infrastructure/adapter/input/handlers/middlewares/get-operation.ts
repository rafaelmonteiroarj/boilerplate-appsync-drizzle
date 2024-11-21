import { ValidationRequestError } from "../../../../../../@common/errors/ValidationRequestError";
import RedisRepository from "../../../../redis/RedisRepository";
import { CustomJwtPayload } from "../../../types";

export const checkOperation = async (
  user: CustomJwtPayload,
  operation: string,
) => {
  switch (operation) {
    case "answers":
      return checkUserQuestionQuota(user);
    default:
      break;
  }
};

const checkUserQuestionQuota = async (user: CustomJwtPayload) => {
  const redisRepo = new RedisRepository();
  try {
    const checkResult = await redisRepo.checkUserQuestionQuota(user);
    if (!checkResult.isAuthorized) {
      return checkResult;
    }
  } catch (err) {
    if (err instanceof ValidationRequestError) {
      return {
        isAuthorized: false,
        validationMessage: err.message,
      };
    } else {
      throw new Error("Erro interno ao verificar a cota de perguntas.");
    }
  }

  return { isAuthorized: true };
};
