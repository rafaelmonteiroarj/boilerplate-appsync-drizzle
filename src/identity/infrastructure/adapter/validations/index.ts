import { Joi } from "celebrate";

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
  email: Joi.string().email().required(),
  // email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9._%+-]+@(claro.com.br|globalhitss.com.br)$')).required(),
  password: Joi.string().required(),
});

export const validationActivateUserSchema = Joi.object().keys({
  userEmail: Joi.string().email().required(),
  isActive: Joi.bool().required(),
});
