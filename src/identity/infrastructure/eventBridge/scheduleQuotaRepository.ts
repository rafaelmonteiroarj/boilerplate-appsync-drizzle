import { IScheduleQuotaRepository } from "../../domain/repositories/schedule-quota.repository";
import dotenv from "dotenv";
import {
  SchedulerClient,
  UpdateScheduleCommand,
  UpdateScheduleCommandInput,
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
      const targetArn =
        process.env.SCHEDULE_QUOTA_ARN ||
        "arn:aws:lambda:us-east-1:769533000303:function:tela-vermelha-pet-updateRechargeQuota";
      const roleArn =
        process.env.SCHEDULE_QUOTA_ROLE_ARN ||
        "arn:aws:iam::769533000303:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_770fb4690a";
      const nameSchedule =
        process.env.SCHEDULE_QUOTA_NAME ||
        "tela-vermelha-pet-recharge-user-quota";

      const params = {
        Name: nameSchedule,
        ScheduleExpression: cron,
        FlexibleTimeWindow: { Mode: "OFF" },
        Target: {
          Arn: targetArn,
          RoleArn: roleArn,
        },
      } as UpdateScheduleCommandInput;

      const command = new UpdateScheduleCommand(params);
      const response = await this.client.send(command);

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
