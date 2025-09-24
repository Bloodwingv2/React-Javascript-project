import React from 'react'
import Search from './components/search.jsx'
import { useState, useEffect } from 'react'

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}



const App = () => {
  const [searchTerm, setsearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const fetchMovies = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch Movies');
      }

      const data = await response.json();
      if (data.response == 'False'){
        setErrorMessage(data.error || 'Failed to fetch Movies');
      }

    } catch(error) {
      console.error(`Error Fetching Movies: ${error}`);
      setErrorMessage("Error Fetching Movies, Please Try Again Later!")
    }
  }

  useEffect(() => {
    fetchMovies();
  }, []);
  

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
          <h1>{searchTerm}</h1>
           <section className='all-movies'>
            <h2>All Movies</h2>
            {errorMessage} && <p className='text-red-500'>{errorMessage}</p>
          </section>
        </div>
    </main>
  )
}

export default App