export interface Product {
  id: string
  name: string
  price: number
  description: string
  createdAt: number
}

export interface ProductFormData {
  name: string
  price: string
  description: string
}

export interface ProductFormErrors {
  name?: string
  price?: string
  description?: string
}
