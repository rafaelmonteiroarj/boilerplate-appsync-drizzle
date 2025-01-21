import { z } from "zod";

export const validationLoginSchema = z.object({
  email: z.string().email("Formato de e-mail inválido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "A Senha não atende aos requisitos mínimos de segurança.",
    ),
});

export const validationLoginByADSchema = z.object({
  name: z.string(),
  email: z.string().email("Formato de e-mail inválido."),
});
