import { Injectable, signal, computed } from '@angular/core';
import { ApiService, ApiError } from './api.service';
import { Product, CreateProduct, UpdateProduct } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // State signals
  readonly products = signal<Product[]>([]);
  readonly selectedProduct = signal<Product | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Computed signals
  readonly productCount = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.products().length > 0);

  constructor(private readonly api: ApiService) {}

  async getAll(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const products = await this.api.get<Product[]>('/api/products');
      this.products.set(products);
    } catch (err) {
      const apiError = err as ApiError;
      this.error.set(apiError.message);
      console.error('Failed to fetch products:', apiError.message);
    } finally {
      this.loading.set(false);
    }
  }

  async getById(id: string): Promise<Product | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const product = await this.api.get<Product>(`/api/products/${id}`);
      this.selectedProduct.set(product);
      return product;
    } catch (err) {
      const apiError = err as ApiError;
      this.error.set(apiError.message);
      console.error('Failed to fetch product:', apiError.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async create(product: CreateProduct): Promise<Product | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const newProduct = await this.api.post<Product, CreateProduct>('/api/products', product);
      this.products.update(products => [...products, newProduct]);
      return newProduct;
    } catch (err) {
      const apiError = err as ApiError;
      this.error.set(apiError.message);
      console.error('Failed to create product:', apiError.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async update(id: string, product: UpdateProduct): Promise<Product | null> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const updatedProduct = await this.api.put<Product, UpdateProduct>(`/api/products/${id}`, product);
      this.products.update(products =>
        products.map(p => p.id === id ? updatedProduct : p)
      );
      if (this.selectedProduct()?.id === id) {
        this.selectedProduct.set(updatedProduct);
      }
      return updatedProduct;
    } catch (err) {
      const apiError = err as ApiError;
      this.error.set(apiError.message);
      console.error('Failed to update product:', apiError.message);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async delete(id: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    try {
      await this.api.delete(`/api/products/${id}`);
      this.products.update(products => products.filter(p => p.id !== id));
      if (this.selectedProduct()?.id === id) {
        this.selectedProduct.set(null);
      }
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      this.error.set(apiError.message);
      console.error('Failed to delete product:', apiError.message);
      return false;
    } finally {
      this.loading.set(false);
    }
  }

  clearSelection(): void {
    this.selectedProduct.set(null);
  }

  clearError(): void {
    this.error.set(null);
  }
}
