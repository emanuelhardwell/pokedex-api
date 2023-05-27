import * as Joi from 'joi';

export const envValidation = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(5000),
  DEFAULT_LIMIT: Joi.number().default(9),
});
