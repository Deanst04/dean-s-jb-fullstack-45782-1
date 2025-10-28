import type AddProduct from "./addProductModel";

export default interface Product extends AddProduct {
    id: string,
    createdAt: number,
    updatedAt: number
}