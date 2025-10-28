import { ChangeEvent, useEffect, useState } from 'react'
import './List.css'
import { Audience } from '../../../models/Audience'
import audienceService from '../../../services/audiences'
import gameService from '../../../services/games'
import { Game } from '../../../models/Game'
import { useForm } from 'react-hook-form'

export default function List() {

    interface MaxPrice {
        maxPrice: number
    }

    const [audiences, setAudiences] = useState<Audience[]>([])
    const [selectedAudienceId, setSelectedAudienceId] = useState<string>('')
    const [games, setGames] = useState<Game[]>([])

    const { register, handleSubmit, reset } = useForm<MaxPrice>()

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

    // games effect
    useEffect(() => {
        (async () => {
            try {
                if(selectedAudienceId) {
                    const games = await gameService.getByAudienceId(selectedAudienceId)
                    setGames(games)
                }
            } catch(e) {
                alert(e)
            }
        })()
    }, [selectedAudienceId])

    function audienceChanged(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedAudienceId(event.currentTarget.value)
    }

    async function filterMaxPrice(draft: MaxPrice) {
        try {
            const games = await gameService.getByMaxPrice(draft.maxPrice)
            setGames(games)
            reset()
        } catch(e) {
            alert(e)
        }
    }

    return (
        <div className='List'>
            <div>
                <select onChange={audienceChanged}>
                    {audiences.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
                </select>

                <form onSubmit={handleSubmit(filterMaxPrice)}>
                    <input type='number' placeholder='max price' {...register('maxPrice')}/>
                    <button>filter</button>
                </form>

                <ul>
                    {games.map(({ id, name }) => <li key={id}>{name}</li>)}
                </ul>
            </div>
        </div>
    )
}