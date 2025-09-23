import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const Card = () => {
  return (
    <div>
      <h2> Card Component</h2>
    </div>
  )
}

const App = () => { // Functional Arrow Component to export the componenent and testing react arch

  return (
    <div>
      <h2> Functional Arrow Component</h2>
      <Card />
      <Card />
    </div>
  )
}

export default App
