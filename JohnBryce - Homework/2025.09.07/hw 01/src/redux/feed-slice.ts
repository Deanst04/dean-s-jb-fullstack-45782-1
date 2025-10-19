import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type Post from "../models/post";
import type PostComment from "../models/post-comment";

interface FeedState {
    posts: Post[]
}

const initialState: FeedState = {
    posts: []
}

export const feedSlice = createSlice({
    name: 'feed',
    initialState,
    reducers: {
        init: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload
        },
        newComment: (state, action: PayloadAction<PostComment>) => {
            const post = state.posts.find(p => p.id === action.payload.postId)
            post?.comments.push(action.payload)
        },
        appendFeedPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = [...action.payload, ...state.posts]
        },
        refreshFeed: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload
        }
    }
})

export const { init, newComment, appendFeedPosts, refreshFeed } = feedSlice.actions
export default feedSlice.reducer