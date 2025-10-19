import { useEffect, useState } from 'react'
import type PostModel from '../../../models/post'
import './Feed.css'
import feedService from '../../../services/feed'
import Post from '../post/Post'
import type PostComment from '../../../models/post-comment'
import Spinner from '../../common/spinner/Spinner'
import useTitle from '../../../hooks/useTitle'

export default function Feed() {

    // useEffect(() => {
    //     document.title = 'Feed'
    // }, [])

    useTitle('Feed')

    const [feed, setFeed] = useState<PostModel[]>([])

    useEffect(() => {
        feedService.getFeed()
            .then(setFeed)
            .catch(alert)
    }, [])

    function removeMe(id: string): void {
        console.log(id)
    }

    function newFeed(comment: PostComment) {
            const newFeed = feed.find(post => post.id === comment.postId)
            newFeed?.comments.push(comment)
            setFeed([ ...feed ])
    }

    return (
        <div className='Feed'>
            {feed.length > 0 && <>
                {feed.map(post => <Post
                    key={post.id}
                    post={post}
                    isEditAllowed={false}
                    removePost={removeMe}
                    newComment={newFeed}
                />)}
            </>}
            {feed.length === 0 && <>
                <div className='FeedLoading'>
                    <Spinner />
                    <span>Loading Feed Page...</span>
                </div>
            </>}
        </div>
    )
}