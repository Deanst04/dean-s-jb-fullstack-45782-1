import { useNavigate } from 'react-router-dom'
import type PostModel from '../../../models/post'
import profileService from '../../../services/profile'
import './Post.css'
import PostComments from '../comments/post-comments/PostComments'
import type PostComment from '../../../models/post-comment'
import { useState } from 'react'
import LoadingButton from '../../common/loading-button/LoadingButton'

interface PostProps {
    post: PostModel,
    isEditAllowed: boolean,
    removePost(id: string): void
    newComment(comment: PostComment): void
}

export default function Post(props: PostProps) {

    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    const { 
        title, 
        createdAt, 
        user: { name }, 
        body, 
        id, 
        imageUrl, 
        comments 
    } = props.post

    const { removePost, isEditAllowed, newComment } = props

    const navigate = useNavigate()

    async function removeMe() {
        if (!confirm('are you sure?')) return;

        setIsDeleting(true)
        try {
            await profileService.remove(id)
            removePost(id)
        } catch (e) {
            alert(e)
        } finally {
            setIsDeleting(false)
        }
    }

    async function editMe() {
        setIsEditing(true)
        try {
            await new Promise(res => setTimeout(res, 1000))
            navigate(`/profile/edit/${id}`)
        } finally {
            setIsEditing(false)
        }

        
    }

    return (
        <div className='Post'>
            <div><h3>{title}</h3></div>
            <div>{(new Date(createdAt)).toLocaleDateString()} by {name}</div>
            <div>{body}</div>
            {imageUrl && <div><img src={imageUrl} /></div>}
            {/* conditional rendering (render something depending on a boolean value):  */}
            {isEditAllowed && <div>
                {/* <button onClick={removeMe}>Delete</button><button onClick={editMe}>edit</button> */}
                <LoadingButton
                    cfa='Delete'
                    message='Deleting...'
                    isLoading={isDeleting}
                    onClick={removeMe}
                />
                <LoadingButton
                    cfa='Edit'
                    message='Opening editor'
                    isLoading={isEditing}
                    onClick={editMe}
                />
            </div>}

            <PostComments
                comments={comments}
                postId={id}
                newComment={newComment}
            />


        </div>
    )
}