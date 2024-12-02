export interface IScheduleQuotaRepository {
  scheduleQuota(cron: string): Promise<boolean>;
}
