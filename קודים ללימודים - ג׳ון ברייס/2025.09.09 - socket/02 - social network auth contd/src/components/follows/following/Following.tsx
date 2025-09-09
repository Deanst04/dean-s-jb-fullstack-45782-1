import { useEffect } from 'react'
import './Following.css'
import Follow from '../follow/Follow'
import Spinner from '../../common/spinner/Spinner'
import { useAppDispatcher, useAppSelector } from '../../../redux/hooks'
import { init } from '../../../redux/following-slice'
import useService from '../../../hooks/use-service'
import FollowingService from '../../../services/auth-aware/FollowingService'

export default function Following() {

    // const [following, setFollowing] = useState<User[]>([])
    const following = useAppSelector(store => store.followingSlice.following)
    const dispatch = useAppDispatcher()

    const followingService = useService(FollowingService)

    useEffect(() => {

            (async () => {
                try {
                    const following = await followingService.getFollowing()
                    dispatch(init(following))
                } catch (e) {
                    alert(e)
                }
                
            })()
    }, [dispatch, followingService])

    return (
        <div className='Following'>
            
            {following.length > 0 && <>
            <h3>Followings</h3>
            {following.map(follow => <Follow
                key={follow.id}
                user={follow}
                />)}
            </>}
            {following.length === 0 && <>
                <Spinner />
            </>}
        </div>
    )
}