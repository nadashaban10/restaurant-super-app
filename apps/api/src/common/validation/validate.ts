import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type Targets = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

declare global {
  namespace Express {
    interface Request {
      validatedQuery?: unknown;
    }
  }
}

export function validate(schema: Targets) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.validatedQuery = schema.query.parse(req.query);
    }
    if (schema.params) {
      const parsed = schema.params.parse(req.params);
      Object.assign(req.params, parsed);
    }
    next();
  };
}
