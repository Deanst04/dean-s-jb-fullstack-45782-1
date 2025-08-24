import { useState } from 'react'
import './App.css'
import CatList from '../cat-list/CatList'
import DogList from '../dog-list/DogList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      < CatList />
      <DogList />
    </div>

  )
}

export default App
