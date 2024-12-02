import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { CustomJwtPayload } from "../../../../../@common/types/jwt.types";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { decode } from "jsonwebtoken";
import { validationGetUserQuotaSchema } from "../../validations";
import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";
import { getToken } from "../../../../../@common/utils/functions";
import { GetUserQuotaUseCase } from "../../../../application/usecases/get-user-quota-useCase";
import RedisRepository from "../../../redis/RedisRepository";

export const handler = async (event: AppSyncEvent) => {
  try {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );
    const redisRepository = new RedisRepository();

    const payload = event["arguments"]["input"];

    const token = getToken(event);

    const { error } = validationGetUserQuotaSchema.validate(payload);

    if (error) {
      error.details.forEach((e) => {
        if (e.path.includes("userEmail")) {
          throw new ValidationRequestError("O e-mail deve ser válido.");
        }
      });
    }

    const decodedJwt = decode(token) as CustomJwtPayload;

    if (!decodedJwt) {
      throw new Error("Invalid token payload");
    }

    const getQuotaUseCase = new GetUserQuotaUseCase(
      userRepository,
      redisRepository,
    );

    const response = await getQuotaUseCase.execute({
      sessionUserEmail: decodedJwt.email,
      email: payload["userEmail"],
    });

    return response;
  } catch (error) {
    throw new Error(`Error get quota user: ${error}`);
  }
};
