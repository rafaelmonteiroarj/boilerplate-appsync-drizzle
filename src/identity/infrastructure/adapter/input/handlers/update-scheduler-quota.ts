import { AppSyncEvent } from "../../../../../@common/types/appsync-event";
import { CustomJwtPayload } from "../../../../../@common/types/jwt.types";
import { DynamoRepository } from "../../../dynamodb/UserRepository";
import { decode } from "jsonwebtoken";
import { validationActivateUserSchema } from "../../validations";
import { ValidationRequestError } from "../../../../../@common/errors/ValidationRequestError";
import { getToken } from "../../../../../@common/utils/functions";
import { UpdateScheduleQuotaUseCase } from "../../../../application/usecases/update-schedule-quota-useCase";
import { ScheduleQuotaRepository } from "../../../eventBridge/scheduleQuotaRepository";

export const handler = async (event: AppSyncEvent) => {
  try {
    const userRepository = new DynamoRepository(
      `${process.env.DYNAMODB_TABLE}`,
    );

    const eventRepository = new ScheduleQuotaRepository();
    const payload = event["arguments"]["input"];

    const token = getToken(event);

    const { error } = validationActivateUserSchema.validate(payload);

    if (error) {
      error.details.forEach((e) => {
        if (e.path.includes("hour")) {
          throw new ValidationRequestError("Hora inválida");
        }
      });
    }

    const decodedJwt = decode(token) as CustomJwtPayload;

    if (!decodedJwt) {
      throw new Error("Invalid token payload");
    }

    const updateSchedulerUseCase = new UpdateScheduleQuotaUseCase(
      eventRepository,
      userRepository,
    );

    const response = await updateSchedulerUseCase.execute({
      sessionUserEmail: decodedJwt.email,
      hours: payload["hour"],
    });

    return response;
  } catch (error) {
    throw new Error(`Error get quota user: ${error}`);
  }
};
