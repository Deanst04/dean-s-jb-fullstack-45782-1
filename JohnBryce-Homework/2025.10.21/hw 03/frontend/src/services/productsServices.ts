import axios from "axios"
import type Product from "../models/product";
import type AddProduct from "../models/addProductModel";

class ProductsServices {
    async getAllProductsByCategory(categoryId: number): Promise<Product[]> {
        const response = await axios.get(`${import.meta.env.VITE_REST_SERVER_URL}/products/${categoryId}`)
        return response.data
    }

    async addProduct(categoryId: number, product: AddProduct): Promise<Product> {
        const response = await axios.post(`${import.meta.env.VITE_REST_SERVER_URL}/products/${categoryId}`, product)
        return response.data
    }

    async removeProduct(productId: number): Promise<boolean> {
        const response = await axios.delete(`${import.meta.env.VITE_REST_SERVER_URL}/products/${productId}`)
        return response.data
    }
    
}

const productsServices = new ProductsServices()
export default productsServices