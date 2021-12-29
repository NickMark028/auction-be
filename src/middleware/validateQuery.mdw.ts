import Ajv, { Schema } from 'ajv';
import { Request, Response, NextFunction } from 'express';

export default function validateQuery(schema: Schema) {
  return function (req: Request, res: Response, next: NextFunction) {
    const ajv = new Ajv();
    if (!ajv.validate(schema, req.query)) {
      res.status(400).json({
        message: 'invalid-query',
      });
      return;
    }

    next();
  };
}
