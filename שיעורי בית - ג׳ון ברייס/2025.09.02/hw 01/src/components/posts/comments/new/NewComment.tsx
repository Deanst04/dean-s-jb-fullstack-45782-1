import { useForm } from 'react-hook-form'
import type PostCommentDraft from '../../../../models/post-comment-draft'
import './NewComment.css'
import commentsService from '../../../../services/comments'
import type PostComment from '../../../../models/post-comment'
import LoadingButton from '../../../common/loading-button/LoadingButton'
import { useState } from 'react'

interface NewCommentProps {
    postId: string
    newComment(comment: PostComment): void
}

export default function NewComment(props: NewCommentProps) {

    const { postId, newComment } = props

    const { register, handleSubmit, reset, formState } = useForm<PostCommentDraft>()

    const [isAddingComment, setIsAddingComment] = useState<boolean>(false)

    async function submit(draft: PostCommentDraft) {
        setIsAddingComment(true)
        try {
            const comment = await commentsService.newComment(postId, draft)
            reset()
            newComment(comment)
        } catch (e) {
            alert(e)
        } finally {
            setIsAddingComment(false)
        }

    }

    return (
        <div className='NewComment'>
            <form onSubmit={handleSubmit(submit)}>
                <textarea {...register('body', {
                    required: {
                        value: true,
                        message: 'Body is required'
                    },
                    minLength: {
                        value: 20,
                        message: 'short comments are not for us'
                    }
                })}></textarea>
                <div className="formError">{formState.errors.body?.message}</div>
                {/* <button>add comment</button> */}
                <LoadingButton
                    cfa='Add Comment'
                    message='Adding Comments...'
                    isLoading={isAddingComment}
                    onClick={handleSubmit(submit)}
                />
            </form>
        </div>
    )
}