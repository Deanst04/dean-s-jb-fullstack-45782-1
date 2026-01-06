export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProduct {
  name: string;
  price: number;
  stock: number;
}

export interface UpdateProduct {
  name?: string;
  price?: number;
  stock?: number;
}
