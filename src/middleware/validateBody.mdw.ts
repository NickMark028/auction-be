import Ajv, { Schema } from 'ajv';
import { Request, Response, NextFunction } from 'express';

export default function validateBody(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const ajv = new Ajv();
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json({
        message: 'invalid-schema',
      });
      return;
    }

    next();
  };
}
