export interface IRechargeQuotaRepository {
  recharge(): Promise<string>;
}
