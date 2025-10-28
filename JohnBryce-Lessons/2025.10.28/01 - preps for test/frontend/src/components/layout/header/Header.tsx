import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {

    return (
        <div className='Header'>
            <div>logo</div>
            <nav>
                {/* <a href="/profile">Profile</a> | <a href="/feed">Feed</a> */}
                <NavLink to="/games">games</NavLink> | <NavLink to="/new-game">new game</NavLink>

            </nav>
            <div>
                welcome
            </div>
        </div>
    )
}