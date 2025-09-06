import Spinner from '../spinner/Spinner'
import './LoadingButton.css'

interface LoadingButtonProps {
    cfa: string,
    message: string,
    isLoading: boolean,
    onClick?: () => void
}

export default function LoadingButton(props: LoadingButtonProps) {

    const {cfa, message, isLoading, onClick} = props
    
    return (
        <button className='LoadingButton' onClick={onClick} disabled={isLoading}>

        {isLoading && (
            <span className='LoadingContent'>
                <Spinner /> {message}
            </span>
        )}

        {!isLoading && cfa}

        </button>
    )
}