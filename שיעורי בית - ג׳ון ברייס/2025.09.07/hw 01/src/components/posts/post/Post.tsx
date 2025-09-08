import { useNavigate } from 'react-router-dom'
import type PostModel from '../../../models/post'
import profileService from '../../../services/profile'
import './Post.css'
import PostComments from '../comments/post-comments/PostComments'
import { useAppDispatcher } from '../../../redux/hooks'
import { deletePost } from '../../../redux/profile-slice'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import { useState } from 'react'

interface PostProps {
    post: PostModel,
    isEditAllowed: boolean,
}

export default function Post(props: PostProps) {

    const { 
        title, 
        createdAt, 
        user: { name }, 
        body, 
        id, 
        imageUrl, 
        comments 
    } = props.post

    const { isEditAllowed } = props

    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const [isEditing, setIsEditing] = useState<boolean>(false)

    const navigate = useNavigate()

    const dispatch = useAppDispatcher()

    async function removeMe() {
        try {
            if (confirm('are you sure?')) {
                setIsDeleting(true)
                await profileService.remove(id)
                dispatch(deletePost(id))
            }
        } catch (e) {
            alert(e)
        } finally {
            setIsDeleting(false)
        }
    }

    function editMe() {
        setIsEditing(true)
        setTimeout(() => {
            navigate(`/profile/edit/${id}`)
            setIsEditing(false)
        }, 1000)
    }

    return (
        <div className='Post'>
            <div><h3>{title}</h3></div>
            <div>{(new Date(createdAt)).toLocaleDateString()} by {name}</div>
            <div>{body}</div>
            {imageUrl && <div><img src={imageUrl} /></div>}
            {/* conditional rendering (render something depending on a boolean value):  */}
            {isEditAllowed && <div className="PostButtons">
                {/* <button onClick={removeMe}>Delete</button><button onClick={editMe}>edit</button> */}
                <SpinnerButton
                    buttonText='Delete'
                    loadingText='Deleting...'
                    isSubmitting={isDeleting}
                    onClick={removeMe}
                />
                <SpinnerButton 
                    buttonText='Edit'
                    loadingText='Open Editor...'
                    isSubmitting={isEditing}
                    onClick={editMe}
                />
            </div>}

            <PostComments
                comments={comments}
                postId={id}
            />


        </div>
    )
}