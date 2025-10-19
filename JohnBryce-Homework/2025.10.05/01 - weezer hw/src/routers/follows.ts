import { Router } from "express";
import { follow, getFollowers, getFollowing, unfollow } from "../controllers/follows/controller";
import { paramValidation } from "../middlewares/validation";
import { followeeIdValidator } from "../controllers/follows/validator";

const router = Router()

router.get('/following', getFollowing)
router.get('/followers', getFollowers)
router.post('/follow/:followeeId', paramValidation(followeeIdValidator), follow)
router.post('/unfollow/:followeeId', paramValidation(followeeIdValidator), unfollow)

export default router