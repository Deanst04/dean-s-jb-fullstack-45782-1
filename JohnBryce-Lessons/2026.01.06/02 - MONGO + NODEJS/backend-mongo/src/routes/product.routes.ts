import { Router } from "express";
import { productController } from "../controllers/product.controller";

const router = Router();

router.get("/", (req, res, next) => productController.getAll(req, res, next));
router.get("/:id", (req, res, next) => productController.getById(req, res, next));
router.post("/", (req, res, next) => productController.create(req, res, next));

export const productRoutes = router;
