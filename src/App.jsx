import React from 'react'
import Search from './components/search.jsx'
import { useState } from 'react'

const App = () => {
  const [searchTerm, setsearchTerm] = useState('I AM BATMAN');

  return (
    <main>
      <div className='pattern'/>
        <div className='wrapper'>
          <header>
            <img src = "./hero.png" alt="Hero bannner"/>
            <h1>
              Find <span className='text-gradient'>Movies</span> you will Enjoy!
            </h1>
          </header>

          <Search searchTerm={searchTerm} setsearchTerm={setsearchTerm}/>
        </div>
    </main>
  )
}

export default App