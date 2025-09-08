import { useEffect } from 'react'
import './Feed.css'
import feedService from '../../../services/feed'
import Post from '../post/Post'
import type PostComment from '../../../models/post-comment'
import Spinner from '../../common/spinner/Spinner'
import useTitle from '../../../hooks/useTitle'
import { useAppDispatcher, useAppSelector } from '../../../redux/hooks'
import { init } from '../../../redux/feed-slice'

export default function Feed() {

    // useEffect(() => {
    //     document.title = 'Feed'
    // }, [])

    useTitle('Feed')

    const feed = useAppSelector(store => store.feedSlice.posts)
    const dispatch = useAppDispatcher()

    useEffect(() => {
        (async () => {
            if (feed.length === 0) {
                const feedFromServer = await feedService.getFeed()
                dispatch(init(feedFromServer))
            }
        })()
    }, [dispatch, feed.length])

    return (
        <div className='Feed'>
            {feed.length > 0 && <>
                {feed.map(post => <Post
                    key={post.id}
                    post={post}
                    isEditAllowed={false}
                />)}
            </>}
            {feed.length === 0 && <>
                <Spinner />
            </>}
        </div>
    )
}