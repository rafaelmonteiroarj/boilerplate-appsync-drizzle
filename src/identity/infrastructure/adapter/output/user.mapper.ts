import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { User } from "../../../domain/entities/user.entity";

export const userMapper = (item: Record<string, AttributeValue>): User => {
  return {
    id: item.id.S!,
    name: item.name.S!,
    email: item.email.S!,
    active: item.active.BOOL!,
    isAdmin: item.isAdmin.BOOL!,
    password: item.password?.S,
    questionlimitQuota: Number(item.question_limit_quota.N!),
    createdAt: new Date(item.createdAt.S!),
    updatedAt: new Date(item.updatedAt.S!),
  };
};
