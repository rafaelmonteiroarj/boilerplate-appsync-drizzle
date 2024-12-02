import { IScheduleQuotaRepository } from "../../domain/repositories/schedule-quota.repository";

const {
  EventBridgeSchedulerClient,
  UpdateScheduleCommand,
} = require("@aws-sdk/client-scheduler");

class ScheduleQuotaRepository implements IScheduleQuotaRepository {
  private client;
  constructor() {
    this.client = new EventBridgeSchedulerClient({ region: "us-east-1" }); // Altere para sua região
  }
  async scheduleQuota(cron: string): Promise<boolean> {
    try {
      const params = {
        Name: "nome-do-seu-agendamento",
        ScheduleExpression: cron,
        FlexibleTimeWindow: { Mode: "OFF" },
      };

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
