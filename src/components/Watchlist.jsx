import MovieCard from './MovieCard'

function Watchlist({ watchlist, onRemove, onShowSongs, onBack }) {
  return (
    <div className="watchlist-page">
      <button className="back-btn" onClick={onBack}>← Back to Home</button>
      <h2 className="section-title">My Watchlist</h2>
      {watchlist.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">Your watchlist is empty</p>
          <p className="empty-sub">Add some movies to get started!</p>
        </div>
      ) : (
        <div className="movie-grid">
          {watchlist.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              isInWatchlist={true}
              onAddWatchlist={onRemove}
              onShowSongs={onShowSongs}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist
