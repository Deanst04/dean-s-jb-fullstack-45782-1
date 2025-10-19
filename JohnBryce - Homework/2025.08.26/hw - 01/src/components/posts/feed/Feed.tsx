import './Feed.css'
import feedService from '../../../services/feed'
import type Post from '../../../models/post'
import { useEffect, useState } from 'react'


export default function Feed() {

    const [feed, setFeed] = useState<Post[]>([])

    useEffect(() => {
        (async () => {
            try {
                const feed = await feedService.getFeed()
                setFeed(feed)
            } catch (e) {
                alert(e)
            }
        })()

        return () => {}
    }, [])

    return (
        <div className='Feed'>
            <ul>
                {feed.map(({id, title, user : { name }, createdAt, comments}) => <li key={id}>{title} on {new Date(createdAt).toLocaleDateString()} by {name} ({comments.length})</li>)}
            </ul>
        </div>
    )
}