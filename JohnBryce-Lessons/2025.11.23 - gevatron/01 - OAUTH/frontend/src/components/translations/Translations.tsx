import { useState } from 'react';
import './Translations.css';
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';

export default function Translations() {

    const [isPaying, setIsPaying] = useState<boolean>(false)

    const stripePromise = loadStripe('pk_test_51SWZY4Bw7GmmRmyUG1Rm2KX4YV15TjxiPWhImDRiNo9s2L4dPusbAuNqNXwFCVl4MXUO2Dn89UJsNYmbPOlmzQff00iuvDASq5')

    return (
        <div className='Translations'>
            {isPaying && <>
                translation form...
            </>}

            {!isPaying && <>
                <Elements stripe={stripePromise} options={{
                    mode: 'payment',
                    amount: 100,
                    currency: 'usd'
                }}>
                    <CheckOutForm />
                </Elements>
            </>}
        </div>
    )
}

function CheckOutForm() {

    const stripe = useStripe()
    const elements = useElements()

    const [errorMassage, setErrorMassage] = useState<string>('')

    async function handleSubmit(event: {preventDefault: Function}) {
        event.preventDefault()

        // this create payment intent
        const {error: submitError} = await elements!.submit()

        // if payment intent failed, show it in the GUI
        if(submitError) {
            setErrorMassage(submitError.message!)
        }

        const response = await axios.post('http://localhost:3000/stripe/payment-intent')
        const { paymentIntent, clientSecret } = response.data

        const { error } = await stripe!.confirmPayment({ 
            elements: elements!,
            clientSecret,
            confirmParams: {
                return_url: 'http://localhost:5173/payment-complete'
            }
        })
        if(error) {
            setErrorMassage(error.message!)
        }


    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button type='submit'>
                Pay
            </button>
            {errorMassage}
        </form>
    )
}