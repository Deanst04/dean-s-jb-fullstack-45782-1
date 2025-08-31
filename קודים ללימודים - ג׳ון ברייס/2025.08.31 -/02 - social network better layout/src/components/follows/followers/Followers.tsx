import { useEffect, useState } from 'react'
import followersService from '../../../services/followers'
import './Followers.css'
import type User from '../../../models/user'
import Follow from '../follow/Follow'

export default function Followers() {
    const [followers, setFollowers] = useState<User[]>([])

    useEffect(() => {
        followersService.getFollowers()
            .then(setFollowers)
            .catch(alert)
    }, [])

    return (
        <div className='Followers'>
            <ul>
                {followers.map(follower => <Follow key={follower.id}  user={follower}/>)}
            </ul>
        </div>
    )
}