import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-vegetables',
  standalone: false,
  templateUrl: './vegetables.html',
  styleUrl: './vegetables.scss',
})
export class Vegetables {
  products: Product[];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProductsByCategory('vegetables');
  }

  getStockStatus(product: Product) {
    return this.productService.getStockStatus(product);
  }
}
