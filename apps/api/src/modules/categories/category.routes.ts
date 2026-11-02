import { Router } from "express";
import { asyncHandler } from "../../common/http/asyncHandler";
import { validate } from "../../common/validation/validate";
import * as controller from "./category.controller";
import {
  categoryIdParamsSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";

export const categoryRouter = Router();

categoryRouter.get("/", asyncHandler(controller.listCategories));
categoryRouter.get(
  "/:id",
  validate({ params: categoryIdParamsSchema }),
  asyncHandler(controller.getCategory),
);
categoryRouter.post(
  "/",
  validate({ body: createCategorySchema }),
  asyncHandler(controller.createCategory),
);
categoryRouter.patch(
  "/:id",
  validate({ params: categoryIdParamsSchema, body: updateCategorySchema }),
  asyncHandler(controller.updateCategory),
);
categoryRouter.delete(
  "/:id",
  validate({ params: categoryIdParamsSchema }),
  asyncHandler(controller.deleteCategory),
);
