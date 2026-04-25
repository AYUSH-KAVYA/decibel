function MySongs({ mySongs, onRemoveSong, onBack }) {
  return (
    <div className="songs-page">
      <button className="back-btn" onClick={onBack}>← Back to Home</button>
      <div className="all-songs-header">
        <h2 className="section-title">My Songs</h2>
        <p className="songs-subtitle">Songs you've saved from YouTube</p>
      </div>

      {mySongs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-text">No songs yet</p>
          <p className="empty-sub">Search for a movie, click the Find Songs button, and add some YouTube songs!</p>
        </div>
      ) : (
        <div className="songs-list">
          {mySongs.map((song, i) => (
            <div className="song-item" key={song.id}>
              <span className="song-number">{i + 1}</span>
              {song.thumbnail && (
                <div className="song-thumb-wrap">
                  <a href={"https://www.youtube.com/watch?v=" + song.id} target="_blank" rel="noopener noreferrer">
                    <img className="song-thumb" src={song.thumbnail} alt={song.title} />
                    <div className="song-play-overlay">▶</div>
                  </a>
                </div>
              )}
              <div className="song-details">
                <div className="song-name" dangerouslySetInnerHTML={{ __html: song.title }}></div>
                <div className="song-artist">{song.artist}</div>
                <div className="song-movie-name">{song.movieName}</div>
              </div>
              <button
                className="song-add-btn added"
                onClick={() => onRemoveSong(song)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MySongs
