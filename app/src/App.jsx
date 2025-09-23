import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Card = ({title}) => { // Functional Arrow Component to Test use states and changing variables!
  const [count, setcount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  useEffect(() => {
    console.log(`${title} has been liked: ${hasLiked}`);
  }, [hasLiked]); // Effect hook to log console info using a dependency array

  useEffect(() => {
    console.log(`CARD RENDERED`)
  },[]); // Useffect for logging
  

  return ( // conditional rendering tests
    <div className = "card" onClick={() => setcount(count + 1)}>
      <h2>{title}<br/>{count || null}</h2> 
      <button onClick={() => setHasLiked(!hasLiked)}> 
        {hasLiked ? '❤️': '🤍'} 
      </button>
    </div>
  )
}

const App = () => { // Functional Arrow Component to export the componenent and testing react arch
  return (
    <div className = "card-container">
      <Card title ="Star Wars" />
      <Card title = "Avengers" />
      <Card title = "Conjuring" />
    </div>
  )
}

export default App
