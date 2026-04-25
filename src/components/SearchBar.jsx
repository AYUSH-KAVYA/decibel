// SearchBar component
// has input field, AI toggle button, and Music/Movie toggle
function SearchBar({ searchQuery, setSearchQuery, aiEnabled, setAiEnabled, onSearch, onMusicSearch, currentPage, setCurrentPage }) {
  
  let isMusic = currentPage === "music"

  // handle form submit
  function handleSubmit(e) {
    e.preventDefault()
    if (isMusic) {
      onMusicSearch(searchQuery)
    } else {
      onSearch(searchQuery)
    }
  }

  function toggleMode() {
    if (isMusic) {
      setCurrentPage("home")
    } else {
      if (searchQuery.trim()) {
        onMusicSearch(searchQuery)
      } else {
        setCurrentPage("music")
      }
    }
  }

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder={isMusic ? "Search for music, artists, songs..." : (aiEnabled ? "Describe a movie plot or story..." : "Search for movies...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {!isMusic && (
            <div
              className={"ai-toggle" + (aiEnabled ? " enabled" : "")}
              onClick={() => setAiEnabled(!aiEnabled)}
            >
              <span className="ai-toggle-label">
                {aiEnabled ? "AI Active" : "AI Search"}
              </span>
            </div>
          )}
          <div
            className={"music-search-btn" + (isMusic ? " active" : "")}
            onClick={toggleMode}
          >
            <span className="music-search-label">
              {isMusic ? "Switch to Movies" : "Switch to Music"}
            </span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
