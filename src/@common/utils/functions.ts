import { AppSyncEvent } from "../types/appsync-event";

export const getToken = (event: AppSyncEvent) =>
  event["request"]["headers"]["authorization"].split(" ")[1];

export const timeToCron = (timeString: string) => {
  // Divida a string "hh:mm:ss" em horas, minutos e segundos
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    throw new Error("Hora inválida: deve estar no formato hh:mm:ss (24 horas)");
  }

  // O CRON do EventBridge não suporta segundos, apenas minutos e horas
  return `cron(${minutes} ${hours} * * ? *)`;
};

export const generateRandomString = (length: number) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[]{}<>?";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
};
