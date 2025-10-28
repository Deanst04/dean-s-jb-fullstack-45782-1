import { Router } from "express";
import { createNewGame, deleteGame, filterByMaxPrice, getAllGamesByAudience } from "../controllers/games/controller";
import paramValidation from "../middlewares/param-validation";
import { gamesByAudienceIdValidator, newGameValidator } from "../controllers/games/validator";
import validation from "../middlewares/validation";

const router = Router()

router.get('/by-audience/:audienceId', paramValidation(gamesByAudienceIdValidator) ,getAllGamesByAudience)
router.get('/by-max-price' ,filterByMaxPrice)
router.post('/', validation(newGameValidator), createNewGame)
router.delete('/:id', paramValidation(gamesByAudienceIdValidator), deleteGame)

export default router