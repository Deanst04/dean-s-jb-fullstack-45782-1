import { Router } from "express";
import { newComment } from "../controllers/comments/controller";
import { paramValidation, validation } from "../middlewares/validation";
import { newCommentValidator, postIdValidator } from "../controllers/comments/validator";

const router = Router()

router.post('/:postId', paramValidation(postIdValidator), validation(newCommentValidator),newComment)

export default router