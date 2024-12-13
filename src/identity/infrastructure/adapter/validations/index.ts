import { Joi } from "celebrate";
import { Origin } from "../../../../@common/types/enums";

export const validationRegisterSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  //  email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@(claro.com.br|globalhitss.com.br)$')).required(),
  password: Joi.string()
    .min(8)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$',
      ),
    )
    .required(),
});

export const validationLoginSchema = Joi.object().keys({
  name: Joi.string().when("origin", {
    is: Origin.COE,
    then: Joi.string().min(1).required().messages({
      "string.empty":
        "O campo 'name' não pode ser vazio quando a origem for 'coe'.",
    }),
    otherwise: Joi.string().allow(""),
  }),
  email: Joi.string().email().required().messages({
    "string.email": "O e-mail deve ter um formato válido.",
    "any.required": "O campo e-mail é obrigatório.",
  }),
  // email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@(claro.com.br|globalhitss.com.br)$')).required(),
  password: Joi.string().required(),
  origin: Joi.string()
    .valid(...Object.values(Origin))
    .required()
    .messages({
      "any.required": "O campo 'origin' é obrigatório.",
      "any.only":
        "O campo 'origin' deve ser um dos seguintes valores: coe ou trends.",
    }),
});

export const validationActivateUserSchema = Joi.object().keys({
  userEmail: Joi.string().email().required(),
  isActive: Joi.bool().required(),
});

export const validationGetUserQuotaSchema = Joi.object().keys({
  userEmail: Joi.string().email().required(),
  // .message("O e-mail deve ser valido."),
  // isActive: Joi.bool().required(),
  // .message("Usuário deve estar ativo."),
});

export const validationUpdateScheduleQuotaSchema = Joi.object().keys({
  hour: Joi.string()
    .required()
    .pattern(new RegExp("/^(?:[01]d|2[0-3]):[0-5]d:[0-5]d$/")),
});
