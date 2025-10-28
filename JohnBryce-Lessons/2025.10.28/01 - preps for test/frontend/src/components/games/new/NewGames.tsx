import { useForm } from 'react-hook-form'
import './NewGames.css'
import { GameDraft } from '../../../models/Game-draft'
import { useEffect, useState } from 'react'
import audienceService from '../../../services/audiences'
import { Audience } from '../../../models/Audience'
import gameService from '../../../services/games'
import { useNavigate } from 'react-router-dom'

export default function NewGame() {

    const { register, handleSubmit, reset } = useForm<GameDraft>()

    const [audiences, setAudiences] = useState<Audience[]>([])

    const navigate = useNavigate()

    // audiences effect
    useEffect(() => {
        (async () => {
            try {
                const audiences = await audienceService.getAll()
                setAudiences(audiences)
            } catch(e) {
                alert(e)
            }
        })()
    }, [])

    async function submit(draft: GameDraft) {
        try {
            await gameService.createGame(draft)
            alert('game added successfully')
            reset()
            navigate('/games')
        } catch(e) {
            alert(e)
        }
    }

    return (
        <div className='NewGame'>
            <form onSubmit={handleSubmit(submit)}>
                <select {...register('audienceId')}>
                    <option value={""}>choose audience</option>
                    {audiences.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>
                <input placeholder='name' {...register('name')} />
                <textarea placeholder='description' {...register('description')}></textarea>
                <input type='number' placeholder='price' {...register('price')} />
                <button>add</button>
            </form>
        </div>
    )
}