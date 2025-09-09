import type User from "../../models/user"
import AuthAware from "./AuthAware"

export default class FollowingService extends AuthAware {
    async getFollowing(): Promise<User[]> {
        const { data } = await this.axiosInstance<User[]>(`/follows/following`)
        return data
    }

    async unfollow(userId: string): Promise<boolean> {
        const { data } = await this.axiosInstance.post<boolean>(`${import.meta.env.VITE_REST_SERVER_URL}/follows/unfollow/${userId}`)
        return data
    }

    async follow(userId: string): Promise<boolean> {
        const { data } = await this.axiosInstance.post<boolean>(`${import.meta.env.VITE_REST_SERVER_URL}/follows/follow/${userId}`)
        return data
    }
}