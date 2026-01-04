import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-fruits',
  standalone: false,
  templateUrl: './fruits.html',
  styleUrl: './fruits.scss',
})
export class Fruits {
  products: Product[];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProductsByCategory('fruits');
  }

  getStockStatus(product: Product) {
    return this.productService.getStockStatus(product);
  }
}
