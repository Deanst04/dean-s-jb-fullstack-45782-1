import axios from "axios"
import type Product from "../models/product";

class ProductsServices {
    async getAllProductsByCategory(categoryId: number): Promise<Product[]> {
        const response = await axios.get(`${import.meta.env.VITE_REST_SERVER_URL}/products/${categoryId}`)
        return response.data
    }

    async addProduct(categoryId: number): Promise<Product> {
        const response = await axios.post(`${import.meta.env.VITE_REST_SERVER_URL}/products/${categoryId}`)
        return response.data
    }
}

const productsServices = new ProductsServices()
export default productsServices