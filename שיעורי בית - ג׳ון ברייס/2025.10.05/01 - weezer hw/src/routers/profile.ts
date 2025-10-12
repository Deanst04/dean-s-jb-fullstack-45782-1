import { Router } from "express";
import { createPost, deletePost, getPost, getProfile, updatePost} from "../controllers/profile/controller";
import { validation, paramValidation } from "../middlewares/validation";
import { idValidator, newPostValidator, updatePostValidator } from "../controllers/profile/validator";

const router = Router()

router.get('/', getProfile)
router.get('/:id', paramValidation(idValidator), getPost)
router.delete('/:id', paramValidation(idValidator), deletePost)
router.post('/', validation(newPostValidator), createPost)
router.patch('/:id', paramValidation(idValidator), validation(updatePostValidator),updatePost)

export default router