import { NextFunction, Request, Response } from "express";
import Category from "../../models/category";

export async function getCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const categories = await Category.findAll({
            attributes:["name"],
            order: [["id", "ASC"]]
        })
        res.json(categories)
    } catch(e) {
        next(e)
    }
}