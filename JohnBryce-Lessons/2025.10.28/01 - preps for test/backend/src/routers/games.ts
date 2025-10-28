import { Router } from "express";
import { getAllGamesByAudience } from "../controllers/games/controller";
import paramValidation from "../middlewares/param-validation";
import { gamesByAudienceIdValidator } from "../controllers/games/validator";

const router = Router()

router.get('/by-audience/:audienceId', paramValidation(gamesByAudienceIdValidator) ,getAllGamesByAudience)

export default router