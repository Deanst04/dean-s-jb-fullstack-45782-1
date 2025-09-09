import type PostCommentModel from '../../../../models/post-comment'
import PostComment from '../comment/PostComment'
import NewComment from '../new/NewComment'
import './PostComments.css'


interface PostCommentsProps {
    comments: PostCommentModel[]
    postId: string
    updateFeed?: boolean
}
export default function PostComments(props: PostCommentsProps) {

    const { comments, postId, updateFeed } = props

    return (
        <div className='PostComments'>
            <NewComment
                postId={postId}
                updateFeed={updateFeed}
            />
            <div>total comments: {comments.length}</div>
            {comments.map(comment => <PostComment
                key={comment.id}
                comment={comment}
            />)}
        </div>
    )
}