import type { Request, Response } from "express";
import { param } from "../../common/http/params";
import * as categoryService from "./category.service";

export async function listCategories(_req: Request, res: Response) {
  const data = await categoryService.listCategories();
  res.json({ data });
}

export async function getCategory(req: Request, res: Response) {
  const data = await categoryService.getCategoryById(param(req, "id"));
  res.json({ data });
}

export async function createCategory(req: Request, res: Response) {
  const data = await categoryService.createCategory(req.body);
  res.status(201).json({ data });
}

export async function updateCategory(req: Request, res: Response) {
  const data = await categoryService.updateCategory(param(req, "id"), req.body);
  res.json({ data });
}

export async function deleteCategory(req: Request, res: Response) {
  const data = await categoryService.deleteCategory(param(req, "id"));
  res.json({ data });
}
