import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { User } from "../../../domain/entities/User";

export const userMapper = (item: Record<string, AttributeValue>): User => {
  return {
    id: item.id.S!,
    name: item.name.S!,
    email: item.email.S!,
    active: item.active.BOOL!,
    isAdmin: item.isAdmin.BOOL!,
    createdAt: new Date(item.createdAt.S!),
    updatedAt: new Date(item.updatedAt.S!),
  };
};
