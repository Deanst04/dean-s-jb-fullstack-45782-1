import axios from "axios"
import type Category from "../models/category";

class CategoriesServices {
    async getAllCategory(): Promise<Category[]> {
        const response = await axios.get(`${import.meta.env.VITE_REST_SERVER_URL}/categories`)
        return response.data
    }
}

const categoriesServices = new CategoriesServices()
export default categoriesServices