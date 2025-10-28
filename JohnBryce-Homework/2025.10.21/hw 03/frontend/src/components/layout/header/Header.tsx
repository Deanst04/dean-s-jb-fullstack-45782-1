import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
    return (
        <div className='Header'>
            <div>am:pm logo</div>
            <nav>
                <NavLink to="/products">products</NavLink> | <NavLink to="/add-product">add product</NavLink>
            </nav>
            <div>
                AM:PM
            </div>
        </div>
    )
}