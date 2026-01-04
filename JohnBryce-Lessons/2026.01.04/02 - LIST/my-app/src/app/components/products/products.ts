import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCategory } from '../../models/product.model';

interface CategoryNav {
  path: string;
  label: string;
  icon: string;
  category: ProductCategory;
  gradientFrom: string;
  gradientTo: string;
}

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  categories: CategoryNav[] = [
    { path: 'fruits', label: 'Fruits', icon: '🍎', category: 'fruits', gradientFrom: 'from-amber-400', gradientTo: 'to-orange-500' },
    { path: 'vegetables', label: 'Vegetables', icon: '🥦', category: 'vegetables', gradientFrom: 'from-green-400', gradientTo: 'to-lime-500' },
    { path: 'meat', label: 'Meat', icon: '🥩', category: 'meat', gradientFrom: 'from-rose-400', gradientTo: 'to-red-500' },
    { path: 'dairy', label: 'Dairy', icon: '🧀', category: 'dairy', gradientFrom: 'from-indigo-400', gradientTo: 'to-purple-500' }
  ];

  constructor(private productService: ProductService) {}

  getProductCount(category: ProductCategory): number {
    return this.productService.getProductCountByCategory(category);
  }

  hasLowStock(category: ProductCategory): boolean {
    return this.productService.hasLowStock(category);
  }

  getLowStockCount(category: ProductCategory): number {
    return this.productService.getLowStockCountByCategory(category);
  }

  getTotalInventoryValue(): number {
    return this.productService.getTotalInventoryValue();
  }

  getTotalLowStockCount(): number {
    return this.productService.getLowStockProducts().length;
  }

  getTotalOutOfStockCount(): number {
    return this.productService.getOutOfStockProducts().length;
  }
}
