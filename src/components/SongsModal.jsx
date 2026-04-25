import { useState, useEffect } from 'react'

// YouTube Data API v3 key
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY

function SongsModal({ movie, onClose, mySongs, onAddSong }) {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [playingId, setPlayingId] = useState(null)

  useEffect(() => {

    // Search YouTube using the movie title, year, and specific 'movie songs' keywords to avoid unrelated songs
    const query = encodeURIComponent(`"${movie.Title}" ${movie.Year || ''} movie songs`)
    const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=" + query + "&type=video&videoCategoryId=10&key=" + YOUTUBE_API_KEY

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error.message || "YouTube API error. Check your key.")
        } else if (data.items && data.items.length > 0) {
          const formatted = data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.medium.url,
            movieName: movie.Title
          }))
          setSongs(formatted)
        } else {
          setError("No songs found for this movie.")
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log("YT fetch error:", err)
        setError("Network error. Please check your internet connection.")
        setLoading(false)
      })
  }, [movie])

  function handlePlay(videoId) {
    if (playingId === videoId) {
      setPlayingId(null)
    } else {
      setPlayingId(videoId)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>{movie.Title} Songs</h2>
            <p className="modal-subtitle">Top songs from YouTube</p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Embedded YouTube player */}
        {playingId && (
          <div className="yt-player-wrap">
            <iframe
              width="100%"
              height="220"
              src={"https://www.youtube.com/embed/" + playingId + "?autoplay=1"}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {loading ? (
          <div className="modal-loading">
            <div className="modal-spinner"></div>
            <p>Searching YouTube...</p>
          </div>
        ) : error ? (
          <div className="modal-error">{error}</div>
        ) : songs.length > 0 ? (
          <div className="songs-list">
            {songs.map((song, i) => {
              let isAdded = mySongs.some(s => s.id === song.id)
              let isPlaying = playingId === song.id

              return (
                <div className={"song-item" + (isPlaying ? " playing" : "")} key={song.id}>
                  <span className="song-number">{i + 1}</span>
                  <div className="song-thumb-wrap" onClick={() => handlePlay(song.id)}>
                    <img className="song-thumb" src={song.thumbnail} alt={song.title} />
                    <div className="song-play-overlay">
                      {isPlaying ? "⏸" : "▶"}
                    </div>
                  </div>
                  <div className="song-details">
                    <div className="song-name" dangerouslySetInnerHTML={{ __html: song.title }}></div>
                    <div className="song-artist">{song.artist}</div>
                  </div>
                  <button
                    className={"song-add-btn" + (isAdded ? " added" : "")}
                    onClick={() => onAddSong(song)}
                  >
                    {isAdded ? "✓" : "+"}
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="modal-empty">
            <p>No songs found on YouTube</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SongsModal
