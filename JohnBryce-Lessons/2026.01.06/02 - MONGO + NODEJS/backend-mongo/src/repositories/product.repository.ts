import { ProductModel, ProductDocument, IProduct } from "../models/product.model";

export interface CreateProductData {
  name: string;
  price: number;
  stock: number;
}

export class ProductRepository {
  async getAll(): Promise<ProductDocument[]> {
    return ProductModel.find().exec();
  }

  async getById(id: string): Promise<ProductDocument | null> {
    return ProductModel.findById(id).exec();
  }

  async create(data: CreateProductData): Promise<ProductDocument> {
    const product = new ProductModel(data);
    return product.save();
  }
}

export const productRepository = new ProductRepository();
