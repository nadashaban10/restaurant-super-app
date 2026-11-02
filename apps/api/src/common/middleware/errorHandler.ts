import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../http/AppError";
import { env } from "../../config/env";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: err.flatten(),
      },
    });
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: env.isProd ? "Internal server error" : err instanceof Error ? err.message : "Unknown error",
    },
  });
}
