import RedisRepository from "../../../../redis/RedisRepository";
import { CustomJwtPayload } from "../../../types";

export const checkOperation = async (
  user: CustomJwtPayload,
  operation: string,
) => {
  switch (operation) {
    case "answers":
      await checkUserQuestionQuota(user);
      break;
    default:
      break;
  }
};

const checkUserQuestionQuota = async (user: CustomJwtPayload) => {
  try {
    const redisRepo = new RedisRepository();
    await redisRepo.checkUserQuestionQuota(user);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
