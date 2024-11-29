import { AttributeValue } from "@aws-sdk/client-dynamodb";

import { UserQuota } from "../../../domain/entities/user-quota.entity";

export const userQuotaMapper = (
  item: Record<string, AttributeValue>,
): UserQuota => {
  return {
    id: item.id.S!,
    name: item.name.S!,
    email: item.email.S!,
    isAdmin: item.isAdmin.BOOL!,
    questionlimitQuota: Number(item.questionlimitQuota.N!),
    remainingQuota: Number(item.remainingQuota.N!),
    usedQuota: Number(item.usedQuota.N!),
  };
};
