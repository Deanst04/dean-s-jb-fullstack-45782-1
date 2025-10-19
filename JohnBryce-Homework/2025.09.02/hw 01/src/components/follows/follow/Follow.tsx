import { useState } from 'react'
import type User from '../../../models/user'
import followingService from '../../../services/following'
import './Follow.css'
import LoadingButton from '../../common/loading-button/LoadingButton'

interface FollowProps {
    user: User
    isFollowing?: boolean
    unfollow?(id: string): void
}
export default function Follow(props: FollowProps) {

    const { user: { id, name }, isFollowing, unfollow } = props
    const [isUnfollowing, setIsUnfollowing] = useState<boolean>(false)

    async function unfollowMe() {
        if(!unfollow) return;

        setIsUnfollowing(true)
        try {
            await followingService.unfollow(id)
            unfollow(id)
        } catch (e) {
            alert(e)
        } finally {
            setIsUnfollowing(false)
        }
    }

    return (
        <div className='Follow'>
            <img src="https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg" />
            <div>{name}</div>
            <div>
                {isFollowing && 
                // <button onClick={unfollowMe}>unfollow</button>
                <LoadingButton 
                cfa='Unfollow'
                message='Unfollowing...'
                isLoading={isUnfollowing}
                onClick={unfollowMe}
                />
                }
            </div>
        </div>
    )
}