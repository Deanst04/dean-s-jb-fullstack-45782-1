import { Injectable } from '@angular/core';
import { Product, ProductCategory } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    // Fruits
    { id: 1, name: 'Apple', price: 1.99, stock: 45, category: 'fruits' },
    { id: 2, name: 'Banana', price: 0.79, stock: 120, category: 'fruits' },
    { id: 3, name: 'Orange', price: 2.49, stock: 38, category: 'fruits' },
    { id: 4, name: 'Strawberry', price: 4.99, stock: 15, category: 'fruits' },
    { id: 5, name: 'Mango', price: 3.49, stock: 22, category: 'fruits' },
    { id: 6, name: 'Pineapple', price: 5.99, stock: 8, category: 'fruits' },
    { id: 7, name: 'Grapes', price: 3.99, stock: 0, category: 'fruits' },
    { id: 8, name: 'Watermelon', price: 6.99, stock: 12, category: 'fruits' },
    { id: 9, name: 'Blueberries', price: 5.49, stock: 3, category: 'fruits' },

    // Vegetables
    { id: 10, name: 'Carrot', price: 1.29, stock: 85, category: 'vegetables' },
    { id: 11, name: 'Broccoli', price: 2.99, stock: 32, category: 'vegetables' },
    { id: 12, name: 'Cucumber', price: 1.49, stock: 67, category: 'vegetables' },
    { id: 13, name: 'Tomato', price: 2.79, stock: 54, category: 'vegetables' },
    { id: 14, name: 'Onion', price: 0.99, stock: 140, category: 'vegetables' },
    { id: 15, name: 'Garlic', price: 0.69, stock: 200, category: 'vegetables' },
    { id: 16, name: 'Pepper', price: 1.99, stock: 0, category: 'vegetables' },
    { id: 17, name: 'Spinach', price: 3.49, stock: 18, category: 'vegetables' },
    { id: 18, name: 'Potato', price: 0.89, stock: 95, category: 'vegetables' },

    // Meat
    { id: 19, name: 'Beef Steak', price: 15.99, stock: 12, category: 'meat' },
    { id: 20, name: 'Chicken Breast', price: 8.99, stock: 28, category: 'meat' },
    { id: 21, name: 'Turkey', price: 12.49, stock: 6, category: 'meat' },
    { id: 22, name: 'Lamb Chops', price: 18.99, stock: 4, category: 'meat' },
    { id: 23, name: 'Pork Tenderloin', price: 9.99, stock: 15, category: 'meat' },
    { id: 24, name: 'Sausages', price: 6.49, stock: 35, category: 'meat' },
    { id: 25, name: 'Bacon', price: 7.99, stock: 0, category: 'meat' },

    // Dairy
    { id: 26, name: 'Whole Milk', price: 3.99, stock: 48, category: 'dairy' },
    { id: 27, name: 'Cheddar Cheese', price: 5.49, stock: 25, category: 'dairy' },
    { id: 28, name: 'Greek Yogurt', price: 4.29, stock: 60, category: 'dairy' },
    { id: 29, name: 'Butter', price: 4.99, stock: 2, category: 'dairy' },
    { id: 30, name: 'Heavy Cream', price: 3.79, stock: 18, category: 'dairy' },
    { id: 31, name: 'Cottage Cheese', price: 3.99, stock: 0, category: 'dairy' },
    { id: 32, name: 'Ice Cream', price: 6.99, stock: 22, category: 'dairy' }
  ];

  private readonly LOW_STOCK_THRESHOLD = 10;

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.products.filter(p => p.category === category);
  }

  getProductCountByCategory(category: ProductCategory): number {
    return this.getProductsByCategory(category).length;
  }

  getLowStockProducts(): Product[] {
    return this.products.filter(p => p.stock <= this.LOW_STOCK_THRESHOLD && p.stock > 0);
  }

  getOutOfStockProducts(): Product[] {
    return this.products.filter(p => p.stock === 0);
  }

  getLowStockCountByCategory(category: ProductCategory): number {
    return this.products.filter(
      p => p.category === category && p.stock <= this.LOW_STOCK_THRESHOLD
    ).length;
  }

  hasLowStock(category: ProductCategory): boolean {
    return this.getLowStockCountByCategory(category) > 0;
  }

  getTotalInventoryValue(): number {
    return this.products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }

  getCategoryInventoryValue(category: ProductCategory): number {
    return this.getProductsByCategory(category).reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    );
  }

  isLowStock(product: Product): boolean {
    return product.stock > 0 && product.stock <= this.LOW_STOCK_THRESHOLD;
  }

  isOutOfStock(product: Product): boolean {
    return product.stock === 0;
  }

  getStockStatus(product: Product): 'in-stock' | 'low-stock' | 'out-of-stock' {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= this.LOW_STOCK_THRESHOLD) return 'low-stock';
    return 'in-stock';
  }
}
