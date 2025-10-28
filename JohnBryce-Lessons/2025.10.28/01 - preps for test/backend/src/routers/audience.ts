import { Router } from "express";
import { getAllAudiences } from "../controllers/audience/controller";

const router = Router()

router.get('/', getAllAudiences)

export default router