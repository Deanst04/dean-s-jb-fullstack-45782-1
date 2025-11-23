import { NextFunction, Request, Response } from "express";
import config from 'config'
import Stripe from "stripe";

export async function createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    const secret = config.get<string>('stripe.secret')

    try {

        const stripe = new Stripe(secret)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 100,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        })

        res.json({
            secret,
            paymentIntent
        })

    } catch(e) {
        next(e)
    }
}

export async function webhook(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    // verify the webhook

    // do whatever i want, in this case, i will tag a user record as a paying user
}