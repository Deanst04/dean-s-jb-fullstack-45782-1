import type User from "./user";

export default interface PostComment {
    id: string,
    userId: string,
    postId: string,
    body: string,
    createdAt: string,
    user: User
}