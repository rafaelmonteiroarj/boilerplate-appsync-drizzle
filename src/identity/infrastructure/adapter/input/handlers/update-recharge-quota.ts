import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { CustomJwtPayload } from "../../../../../@common/types/jwt.types";
import { decode } from "jsonwebtoken";
import { getToken } from "../../../../../@common/utils/functions";
import { RechargeQuotaUseCase } from "../../../../application/usecases/recharge-quota-useCase";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { RechargeQuotaRepository } from "../../../rechargeQuota/RerchageQuotaRepository";

export const handler = async (event: AppSyncEvent) => {
  try {
    const token = getToken(event);

    const decodedJwt = decode(token) as CustomJwtPayload;

    if (!decodedJwt) {
      throw new Error("Invalid token payload");
    }

    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );

    const rechargeQuotaRepository = new RechargeQuotaRepository();

    const rechargeQuotaUseCase = new RechargeQuotaUseCase(
      rechargeQuotaRepository,
      userRepository,
    );

    return rechargeQuotaUseCase.execute(decodedJwt.email);
  } catch (error) {
    throw new Error(`Error update quota user: ${error}`);
  }
};
