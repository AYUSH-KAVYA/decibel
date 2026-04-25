// Navbar component - shows brand name and navigation buttons
function Navbar({ currentPage, setCurrentPage, watchlistCount }) {
  let isMovies = currentPage === "home" || currentPage === "watchlist"

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setCurrentPage("home")}>
        {isMovies && <div className="brand-logo">IMDb</div>}
        <h1>Decibel</h1>
      </div>

      <div className="navbar-links">
        <button
          className={"nav-btn" + (currentPage === "watchlist" ? " active" : "")}
          onClick={() => setCurrentPage("watchlist")}
        >
          Watchlist
          {watchlistCount > 0 && (
            <span className="watchlist-count">{watchlistCount}</span>
          )}
        </button>
        <button
          className={"nav-btn" + (currentPage === "songs" ? " active" : "")}
          onClick={() => setCurrentPage("songs")}
        >
          My Songs
        </button>
      </div>
    </nav>
  )
}

export default Navbar
