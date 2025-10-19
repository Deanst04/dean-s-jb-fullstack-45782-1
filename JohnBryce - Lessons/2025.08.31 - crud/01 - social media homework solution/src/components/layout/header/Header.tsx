import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
    return (
        <div className='Header'>
            <div>logo</div>
            <nav>
                {/* <a href="/profile">Profile</a> | <a href="/feed">Feed</a> */}
                <NavLink to="/profile">profile</NavLink> | <NavLink to="/feed">feed</NavLink>
            </nav>
            <div>
                welcome Shahar | logout
            </div>
        </div>
    )
}