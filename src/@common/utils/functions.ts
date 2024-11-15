import { AppSyncEvent } from "../types/appsync-event";

export const getToken = (event: AppSyncEvent) =>
  event["request"]["headers"]["authorization"].split(" ")[1];
