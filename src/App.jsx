import React from 'react'
import Search from './components/search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'

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
  const [movieList, setMovieList] = useState([]);
  const [isloading, setisloading] = useState(false);


  const fetchMovies = async () => {
    setisloading(true);
    setErrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch Movies');
      }

      const data = await response.json();
      if (data.response == 'False'){
        setErrorMessage(data.error || 'Failed to fetch Movies');
        setMovieList([]);
        return;
      }
      
      setMovieList(data.results || []);

    } catch(error) {
      console.error(`Error Fetching Movies: ${error}`);
      setErrorMessage("Error Fetching Movies, Please Try Again Later!")
    } finally{
      setisloading(false);
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
            <h2 className='mt-[40px]'>All Movies</h2>

            {isloading ? (
              <Spinner/>
            ): errorMessage ? (
              <p className='text-red-500'>{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key ={movie.id} movie ={movie}/>
                ))}
              </ul>
            )}
          </section>
        </div>
    </main>
  )
}

export default App