import { ProductDocument } from "../models/product.model";
import { productRepository, CreateProductData } from "../repositories/product.repository";

export class ProductService {
  async getAllProducts(): Promise<ProductDocument[]> {
    return productRepository.getAll();
  }

  async getProductById(id: string): Promise<ProductDocument | null> {
    return productRepository.getById(id);
  }

  async createProduct(data: CreateProductData): Promise<ProductDocument> {
    return productRepository.create(data);
  }
}

export const productService = new ProductService();
