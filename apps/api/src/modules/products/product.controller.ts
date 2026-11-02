import type { Request, Response } from "express";
import { param } from "../../common/http/params";
import * as productService from "./product.service";
import type { ListProductsQuery } from "./product.schema";

export async function listProducts(req: Request, res: Response) {
  const query = (req.validatedQuery ?? {}) as ListProductsQuery;
  const data = await productService.listProducts(query);
  res.json({ data });
}

export async function getProduct(req: Request, res: Response) {
  const data = await productService.getProductById(param(req, "id"));
  res.json({ data });
}

export async function getProductBySlug(req: Request, res: Response) {
  const data = await productService.getProductBySlug(param(req, "slug"));
  res.json({ data });
}

export async function createProduct(req: Request, res: Response) {
  const data = await productService.createProduct(req.body);
  res.status(201).json({ data });
}

export async function updateProduct(req: Request, res: Response) {
  const data = await productService.updateProduct(param(req, "id"), req.body);
  res.json({ data });
}

export async function deleteProduct(req: Request, res: Response) {
  const data = await productService.softDeleteProduct(param(req, "id"));
  res.json({ data });
}
