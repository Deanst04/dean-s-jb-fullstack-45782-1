import './Demo.css'
import singerPic from '../../assets/yahli-sobol.png'
import type { ChangeEvent } from 'react'

export default function Demo() {

    function sayHi() {
        alert(`hi`)
    }

    function selectionChanged(event: ChangeEvent<HTMLInputElement>) {
        alert(`selection changed   ` + event.target.value)
    }

    return (
        <div className='Demo'>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi7fJAXk7MSuNSX--ju6rYrc5CDwINt1mN02Zg9Uf63NLB4yjpZVGR5DSTcS-cttUYqV2p74u6GAfdKAkrd6KP-Md3V4LqvkN2RqSEybKttg" />
            <img src={singerPic} />
            <button onClick={sayHi}>say hi</button>
            <select onChange={selectionChanged}>
                <option value="usd">USD</option>
                <option value="ils">ILS</option>
                <option value="eur">EUR</option>
            </select>
        </div>
    )
}