import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler } from "./common/middleware/errorHandler";
import { notFoundHandler } from "./common/middleware/notFound";
import { healthRouter } from "./modules/health/health.routes";
import { categoryRouter } from "./modules/categories/category.routes";
import { productRouter } from "./modules/products/product.routes";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.isProd ? env.corsOrigins : true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/", (_req, res) => {
    res.json({
      name: "kababgy-shaaban-api",
      version: "0.1.0",
      docs: "Use /health and /api/v1/*",
    });
  });

  app.use("/health", healthRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/products", productRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
