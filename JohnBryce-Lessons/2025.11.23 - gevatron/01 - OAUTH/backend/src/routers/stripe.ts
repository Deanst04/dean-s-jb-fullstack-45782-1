import { Router } from "express";
import { createPaymentIntent, webhook } from "../controllers/stripe/controller";

const router = Router()

router.post('/payment-intent', createPaymentIntent)
router.post('/webhook', webhook)

export default router