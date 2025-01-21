import { z } from "zod";

export const validationRegisterSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório."),
  email: z.string().email("Formato de e-mail inválido."),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
      "A Senha não atende aos requisitos mínimos de segurança.",
    ),
});
