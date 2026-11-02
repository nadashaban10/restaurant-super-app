import { Router } from "express";
import { asyncHandler } from "../../common/http/asyncHandler";
import { validate } from "../../common/validation/validate";
import * as controller from "./product.controller";
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamsSchema,
  productSlugParamsSchema,
  updateProductSchema,
} from "./product.schema";

export const productRouter = Router();

productRouter.get(
  "/",
  validate({ query: listProductsQuerySchema }),
  asyncHandler(controller.listProducts),
);
productRouter.get(
  "/slug/:slug",
  validate({ params: productSlugParamsSchema }),
  asyncHandler(controller.getProductBySlug),
);
productRouter.get(
  "/:id",
  validate({ params: productIdParamsSchema }),
  asyncHandler(controller.getProduct),
);
productRouter.post(
  "/",
  validate({ body: createProductSchema }),
  asyncHandler(controller.createProduct),
);
productRouter.patch(
  "/:id",
  validate({ params: productIdParamsSchema, body: updateProductSchema }),
  asyncHandler(controller.updateProduct),
);
productRouter.delete(
  "/:id",
  validate({ params: productIdParamsSchema }),
  asyncHandler(controller.deleteProduct),
);
