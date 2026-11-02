import type { Request } from "express";
import { AppError } from "./AppError";

export function param(req: Request, name: string): string {
  const value = req.params[name];
  const resolved = Array.isArray(value) ? value[0] : value;
  if (!resolved) {
    throw new AppError(400, "MISSING_PARAM", `Missing route param: ${name}`);
  }
  return resolved;
}
