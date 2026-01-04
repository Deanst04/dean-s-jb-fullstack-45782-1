import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-meat',
  standalone: false,
  templateUrl: './meat.html',
  styleUrl: './meat.scss',
})
export class Meat {
  products: Product[];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProductsByCategory('meat');
  }

  getStockStatus(product: Product) {
    return this.productService.getStockStatus(product);
  }
}
