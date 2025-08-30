import Details from '../details/Details'
import Header from '../header/Header'
import Skills from '../skills/Skills'
import './Layout.css'

export default function Layout() {

    return (
        <div className='Layout'>
            <header>
                <Header />
            </header>
            <section>
                <Details />
            </section>
            <section>
                <Skills />
            </section>
        </div>
    )

}