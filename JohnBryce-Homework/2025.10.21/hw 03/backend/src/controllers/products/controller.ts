import { NextFunction, Request, Response } from "express";
import Product from "../../models/product";
import Category from "../../models/category";

export async function getProductsByCategory(req: Request<{ categoryId: string }>, res: Response, next: NextFunction) {
    try {
        const { products } = await Category.findByPk(req.params.categoryId, {
            include: [Product]
        })
        res.json(products)
    } catch(e) {
        next(e)
    }
}

export async function addProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const newProduct = await Product.create(req.body)
        await newProduct.reload({ include: Category })
        res.json(newProduct)
    } catch(e) {
        next(e)
    }
}

export async function deleteProduct(req: Request<{ productId: string }>, res: Response, next: NextFunction) {
    try {
        const { productId } = req.params
        const deletedRows = await Product.destroy({ where: { id: productId } })
        if (deletedRows === 0) return next({
            status: 404,
            message: 'yo bro, da racord u wana dalete as not yar'
        })
        res.json({ success: true })
    } catch(e) {
        next(e)
    }
}