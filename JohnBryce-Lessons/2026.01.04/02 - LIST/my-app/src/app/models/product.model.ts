export type ProductCategory = 'fruits' | 'vegetables' | 'meat' | 'dairy';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: ProductCategory;
}
