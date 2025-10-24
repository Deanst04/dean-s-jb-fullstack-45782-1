import { NextFunction, Request, Response } from "express";
import Product from "../../models/product";
import Category from "../../models/category";
import { Model } from "sequelize-typescript";

export async function getProductsByCategory(req: Request<{ categoryId: number }>, res: Response, next: NextFunction) {
    try {
        const { categoryId } = req.params
        const products = await Product.findAll({
            where: { categoryId },
            include: [{
                model: Category,
                attributes: ["id", "name"]
            }]
        })
        res.json(products)
    } catch(e) {
        next(e)
    }
}

export async function addProduct(req: Request<{ categoryId: number }>, res: Response, next: NextFunction) {
    try {
        const { categoryId } = req.params
        const newProduct = await Product.create({...req.body, categoryId})
        await newProduct.reload({
            include: [{
                model: Category
            }]
        })
        res.json(newProduct)
    } catch(e) {
        next(e)
    }
}

export async function deleteProduct(req: Request<{ productId: number }>, res: Response, next: NextFunction) {
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