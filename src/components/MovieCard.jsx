// MovieCard component - displays one movie
function MovieCard({ movie, onAddWatchlist, isInWatchlist, onShowSongs }) {
  
  // check if poster exists
  let hasPoster = movie.Poster && movie.Poster !== "N/A"

  return (
    <div className="movie-card">
      <div className="movie-poster-wrap">
        {hasPoster ? (
          <img
            className="movie-poster"
            src={movie.Poster}
            alt={movie.Title}
            loading="lazy"
          />
        ) : (
          <div className="no-poster">No Image</div>
        )}
        <div className="poster-overlay">
          <div className="overlay-rating">
            {movie.imdbRating && movie.imdbRating !== "N/A" ? (
              <span>★ {movie.imdbRating}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <div className="movie-meta">
          <span className="movie-year">{movie.Year}</span>
          <span className="movie-type">{movie.Type || "movie"}</span>
        </div>

        <div className="card-actions">
          <button
            className={"add-watchlist-btn" + (isInWatchlist ? " added" : "")}
            onClick={() => onAddWatchlist(movie)}
          >
            {isInWatchlist ? "✓ Watchlist" : "+ Watchlist"}
          </button>
          <button
            className="songs-btn"
            onClick={() => onShowSongs(movie)}
          >
            Find Songs
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
