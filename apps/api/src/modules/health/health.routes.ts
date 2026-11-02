import { Router } from "express";
import { asyncHandler } from "../../common/http/asyncHandler";
import { env } from "../../config/env";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const mongoReady = mongoose.connection.readyState === 1;
    res.json({
      ok: true,
      env: env.NODE_ENV,
      mongo: mongoReady ? "up" : "down",
    });
  }),
);
