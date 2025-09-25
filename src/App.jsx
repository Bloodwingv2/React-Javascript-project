import Search from './components/search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { useState, useEffect } from 'react'
import { updateSearchCount } from './Appwrite.js'

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounces the search term and prevents too many API Requests
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 575, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query 
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setErrorMessage('No movies found');
        setMovieList([]);
        return;
      }

      setMovieList(data.results);

      // Only update search count for actual searches with results
      if (query && data.results.length > 0) {
        try {
          await updateSearchCount(query, data.results[0]);
        } catch (appwriteError) {
          console.error('Error updating search count:', appwriteError);
          // Don't show Appwrite errors to the user as they're not critical
        }
      }
    } catch (error) {
      console.error('Error Fetching Movies:', error);
      setErrorMessage(
        error.message === 'Failed to fetch' 
          ? 'Network error. Please check your connection.'
          : 'Error fetching movies. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero banner" />
          <h1>
            Find <span className='text-gradient'>Movies</span> you will Enjoy!
          </h1>
        </header>

        <Search 
          searchTerm={searchTerm} 
          setsearchTerm={setSearchTerm}
        />

        <section className='all-movies'>
          <h2 className='mt-[40px]'>
            {debouncedSearchTerm ? 'Search Results' : 'Popular Movies'}
          </h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-red-500'>{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App