import { NavLink } from 'react-router-dom'
import './header.css'

export default function Header() {

    return (
        <div className='Header'>
            <div>logo</div>
            <nav>
                {/* <a href="/profile">Profile</a> | <a href="/feed">Feed</a> */}
                <NavLink to="/games">games</NavLink> | <NavLink to="/list">list</NavLink>

            </nav>
            <div>
                welcome
            </div>
        </div>
    )
}