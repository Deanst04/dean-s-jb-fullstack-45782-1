import { Router } from "express";
import { addProduct, deleteProduct, getProductsByCategory } from "../controllers/products/controller";

const router = Router()

router.get('/:categoryId', getProductsByCategory)
router.post('/:categoryId', addProduct)
router.delete('/:productId', deleteProduct)

export default router