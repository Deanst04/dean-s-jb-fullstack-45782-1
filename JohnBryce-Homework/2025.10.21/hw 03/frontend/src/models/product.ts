import type AddProduct from "./addProductModel";

export default interface Product extends AddProduct {
    id: number,
    categoryId: number
}