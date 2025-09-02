import { useEffect, useState } from 'react'
import './Profile.css'
import profileService from '../../../services/profile'
import type PostModel from '../../../models/post'
import Post from '../post/Post'

export default function Profile() {

    const [profile, setProfile] = useState<PostModel[]>([])

    useEffect(() => {
       
        (async () => {
            try {
                const profile = await profileService.getProfile()
                setProfile(profile)
            } catch (e) {
                alert(e)
            }
       })()

       return () => {

       }
    }, [])

    function removePost(id: string): void {
        setProfile(profile.filter(post => post.id !== id))
    }

    return (
        <div className='Profile'>
            <ul>
                {profile.map(post => <Post 
                key={post.id} 
                post={post} 
                removePost={removePost} 
                isEditAllowed={true}
                />)}
            </ul>
        </div>
    )
}