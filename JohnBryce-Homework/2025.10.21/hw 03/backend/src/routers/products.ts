import { Router } from "express";
import { addProduct, deleteProduct, getProductsByCategory } from "../controllers/products/controller";
import paramValidation from "../middlewares/param-validation";
import { newProductValidator, productById, productsByCategoryId } from "../controllers/products/validator";
import validation from "../middlewares/validation";

const router = Router()

router.get('/:categoryId', paramValidation(productsByCategoryId), getProductsByCategory)
router.post('/', validation(newProductValidator) ,addProduct)
router.delete('/:productId', paramValidation(productById), deleteProduct)

export default router