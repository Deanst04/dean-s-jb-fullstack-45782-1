import type User from "../models/user";

class FollowingServices {
    async getFollowing(): Promise<User[]> {
        const following = await fetch(`${import.meta.env.VITE_REST_SERVER_URL}/follows/following`).then<User[]>(response => response.json())
        return following 
    }
}

const followingServices = new FollowingServices()
export default followingServices