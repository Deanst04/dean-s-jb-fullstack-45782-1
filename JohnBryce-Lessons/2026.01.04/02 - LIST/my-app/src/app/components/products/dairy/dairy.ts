import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-dairy',
  standalone: false,
  templateUrl: './dairy.html',
  styleUrl: './dairy.scss',
})
export class Dairy {
  products: Product[];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProductsByCategory('dairy');
  }

  getStockStatus(product: Product) {
    return this.productService.getStockStatus(product);
  }
}
