import './Followers.css'
import type User from '../../../models/user'
import { useEffect, useState } from 'react'
import followersService from '../../../services/followers'

export default function Followers() {

    const [followers, setFollowers] = useState<User[]>([])

    useEffect(() => {
        (async () => {
            try {
                const followers = await followersService.getFollowers()
                setFollowers(followers)
            } catch (e) {
                alert(e)
            }
        })()

        return () => {}
    }, [])

    return (
        <div className='Followers'>
            <p>{followers.length} people follow you</p>
            <ul>
                {followers.map(({id, name}) => <li key={id}>{name}</li>)}
            </ul>
        </div>
    )
}