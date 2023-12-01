/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MovieCard from './MovieCard'
import './App.css'

const API_KEY = '2dca580c2a14b55200e784d157207b4d'
const API_URL = 'https://api.themoviedb.org/3/discover/movie'
const GENRE_API_URL = 'https://api.themoviedb.org/3/genre/movie/list'

const App = () => {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [year, setYear] = useState(2012)

  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          sort_by: 'popularity.desc',
          primary_release_year: year,
          page: 1,
          'vote_count.gte': 100,
          with_genres: selectedGenres.join(','), // Add selected genres to the query
        },
      })
      setMovies(response.data.results)
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await axios.get(GENRE_API_URL, {
        params: {
          api_key: API_KEY,
        },
      })

      setGenres(response.data.genres)
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const handleScroll = () => {
    const isBottom =
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.scrollHeight

    const isTop = document.documentElement.scrollTop === 0

    if (isBottom && year < new Date().getFullYear()) {
      // User has scrolled to the bottom
      setYear((prevYear) => prevYear + 1)
      // fetchMovies()
    } else if ((isTop && year >= 2012) || (isTop && year < 2012)) {
      // User has scrolled to the top
      setYear((prevYear) => prevYear - 1)
      // fetchMovies()
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [year])

  useEffect(() => {
    fetchMovies()
    fetchGenres()
  }, [year, selectedGenres])

  return (
    <div className='App'>
      <div className='genre-filters'>
        <div className='genre-buttons'>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={selectedGenres.includes(genre.id) ? 'selected' : ''}
              onClick={() =>
                setSelectedGenres((prevGenres) =>
                  prevGenres.includes(genre.id)
                    ? prevGenres.filter((id) => id !== genre.id)
                    : [...prevGenres, genre.id]
                )
              }
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      <div className='movie-container'>
        <div className='year-container'>
          <h1 className='year-title'>{year}</h1>
          <div className='movie-grid'>
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                ratings={movie.vote_average}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
