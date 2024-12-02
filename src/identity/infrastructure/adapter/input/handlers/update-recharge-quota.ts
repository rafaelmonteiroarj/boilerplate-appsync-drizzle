import { RechargeQuotaUseCase } from "../../../../application/usecases/recharge-quota-useCase";
import { RechargeQuotaRepository } from "../../../rechargeQuota/RerchageQuotaRepository";

export const handler = async () => {
  try {
    // const token = getToken(event);

    // const decodedJwt = decode(token) as CustomJwtPayload;

    // if (!decodedJwt) {
    //   throw new Error("Invalid token payload");
    // }

    // const userRepository = new DynamoRepository(
    //   `${process.env.DYNAMODB_TABLE}`,
    // );

    const rechargeQuotaRepository = new RechargeQuotaRepository();

    const rechargeQuotaUseCase = new RechargeQuotaUseCase(
      rechargeQuotaRepository,
    );

    return rechargeQuotaUseCase.execute();
  } catch (error) {
    throw new Error(`Error update quota user: ${error}`);
  }
};
