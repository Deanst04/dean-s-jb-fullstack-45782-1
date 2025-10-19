import { useEffect, useState } from 'react'
import './Following.css'
import type User from '../../../models/user'
import followingServices from '../../../services/following'

export default function Following() {

    const [following, setFollowing] = useState<User[]>([])

    useEffect(() => {
        (async () => {
            try {
                const following = await followingServices.getFollowing()
                setFollowing(following)
            } catch (e) {
                alert(e)
            }
        })()

        return () => {}
    }, [])

    return (
        <div>
            {/* following... */}
            <p>you follow {following.length} people</p>
            <ul>
                {following.map(({id, name}) => <li key={id}>{name}</li>)}
            </ul>
        </div>
    )
}