import { useState } from 'react'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import './Login.css'
import type Login from '../../../models/login'
import type Login from '../../../models/login'

export default function Login() {

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const { register, handleSubmit, reset, formState} = useForm<Login>()

    async function submit(login: Login) {
        
    }

    return (
        <div className='Login'>
            <form>
                <input placeholder="username" {...register('username')}/>
                <input placeholder="password" type="password" {...register('password')}/>
                <SpinnerButton
                    buttonText='Login'
                    loadingText='logging in'
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    )
}

function useForm<T>(): { register: any; handleSubmit: any; reset: any; formState: any } {
    throw new Error('Function not implemented.')
}
