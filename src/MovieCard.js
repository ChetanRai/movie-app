import React from 'react'

const MovieCard = ({ title, image, ratings }) => (
  <div className='movie-card'>
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>
      <em>{ratings}</em>
    </p>
  </div>
)

export default MovieCard
