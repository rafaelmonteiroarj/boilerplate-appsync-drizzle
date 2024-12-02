import { IScheduleQuotaRepository } from "../../domain/repositories/schedule-quota.repository";
import dotenv from "dotenv";
import {
  SchedulerClient,
  UpdateScheduleCommand,
} from "@aws-sdk/client-scheduler"; // ES Modules import

// const {
//   EventBridgeSchedulerClient,
//   UpdateScheduleCommand,
// } = require("@aws-sdk/client-scheduler");

dotenv.config();
class ScheduleQuotaRepository implements IScheduleQuotaRepository {
  private client: SchedulerClient;

  constructor() {
    this.client = new SchedulerClient({ region: "us-east-1" });
  }
  async scheduleQuota(cron: string): Promise<boolean> {
    try {
      const params = {
        Name: "tela-vermelha-pet-recharge-user-quota",
        ScheduleExpression: cron,
        FlexibleTimeWindow: { Mode: "OFF" },
        Target: {
          Arn: process.env.SCHEDULE_QUOTA_ARN,
          RoleArn: process.env.SCHEDULE_QUOTA_ROLE_ARN,
        },
      } as any;

      const command = new UpdateScheduleCommand(params);
      const response = await this.client.send(command);
      console.log("Agendamento atualizado com sucesso:", response);
      if (!response) {
        return false;
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export { ScheduleQuotaRepository };
