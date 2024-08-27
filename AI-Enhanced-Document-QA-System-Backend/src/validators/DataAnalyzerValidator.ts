import * as Joi from "joi";
import { Request, Response, NextFunction } from "express";

export class DataAnalyzerValidator {
  constructor() {}

  validateData = (schema: Joi.ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const val = await schema.validateAsync(req.body);
        req.body = val;
        next();
      } catch (err) {
        const messages = (err as Joi.ValidationError)?.details
          .map((i) => i.message)
          .join(",");

        res.status(422).json({
          success: false,
          errors: [messages],
        });
      }
    };
  };
}

export const dataAnalyzerSchema = Joi.object().keys({
  inputData: Joi.string(),
});


