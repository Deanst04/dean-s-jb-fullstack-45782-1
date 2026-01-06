import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }

      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, price, stock } = req.body;
      const product = await productService.createProduct({ name, price, stock });
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();
