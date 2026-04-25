import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import Watchlist from "./components/Watchlist";
import MySongs from "./components/MySongs";
import SongsModal from "./components/SongsModal";
// omdb KEY
const OMDBAPI = import.meta.env.VITE_OMDB_API;
const OMDB_URL = "https://www.omdbapi.com/";

// YT API
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

function App() {
  // ---- state variables ----
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [mySongs, setMySongs] = useState([]);
  const [currentPage, setCurrentPage] = useState("home"); // home, watchlist, songs, music
  const [songsMovie, setSongsMovie] = useState(null); // movie to show songs for (modal)
  const [aiThinking, setAiThinking] = useState(false);

  // music search state
  const [musicResults, setMusicResults] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState("");
  const [musicQuery, setMusicQuery] = useState("");
  const [playingMusicId, setPlayingMusicId] = useState(null);

  // ---- fetch movies from OMDB ----
  function fetchMovies(query) {
    setLoading(true);
    setError("");

    fetch(
      OMDB_URL +
      "?apikey=" +
      OMDBAPI +
      "&s=" +
      encodeURIComponent(query) +
      "&type=movie",
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          let moviePromises = data.Search.map((m) => {
            return fetch(
              OMDB_URL + "?apikey=" + OMDBAPI + "&i=" + m.imdbID,
            ).then((res) => res.json());
          });

          Promise.all(moviePromises).then((detailedMovies) => {
            setMovies(detailedMovies);
            setLoading(false);
          });
        } else {
          setMovies([]);
          setError(data.Error || "No movies found");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("fetch error:", err);
        setError("Something went wrong. Check your internet.");
        setLoading(false);
      });
  }

  // ---- fetch trending/popular movies on first load ----
  useEffect(() => {
    const trendingIds = [
      "tt15398776",
      "tt15239678",
      "tt6263850",
      "tt1517268",
      "tt9362722",
      "tt1630029",
      "tt1745960",
      "tt10366206",
      "tt6710474",
      "tt1877830",
      "tt4154796",
      "tt0816692",
      "tt0468569",
      "tt1375666",
      "tt6751668",
      "tt10872600",
      "tt8946378",
      "tt7286456",
      "tt9218128",
      "tt6718170",
    ];

    let detailPromises = trendingIds.map((id) => {
      return fetch(OMDB_URL + "?apikey=" + OMDBAPI + "&i=" + id)
        .then((res) => res.json())
        .catch(() => null);
    });

    Promise.all(detailPromises).then((results) => {
      // filter out any that failed
      let validMovies = results.filter((m) => m && m.Response === "True");
      setMovies(validMovies);
      setLoading(false);
    });
  }, []); // empty dependency array = run once

  // ---- handle search ----
  function handleSearch(query) {
    if (!query.trim()) return;

    // if we're on music page, switch back to home
    if (currentPage === "music") {
      setCurrentPage("home");
    }

    if (aiEnabled) {
      // AI search - send the query to AI to get movie name suggestions
      handleAiSearch(query);
    } else {
      // normal search
      fetchMovies(query);
    }
  }

  // ---- AI search using Gemini API ----
  async function handleAiSearch(userQuery) {
    setAiThinking(true);
    setLoading(true);
    setError("");

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const GEMINI_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are a movie recommendation assistant. Given the following description, suggest exactly ONE movie title that best matches it. Return ONLY the exact movie title and nothing else, without quotes or extra text. Description: " +
                    userQuery,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      setAiThinking(false);

      if (data.error) {
        throw new Error(data.error.message || "Gemini API Error");
      }

      if (
        data.candidates &&
        data.candidates[0] &&
        data.candidates[0].content &&
        data.candidates[0].content.parts[0]
      ) {
        let movieToSearch = data.candidates[0].content.parts[0].text.trim();
        console.log("Gemini suggested movie:", movieToSearch);
        // now use standard fetch with the determined movie
        fetchMovies(movieToSearch);
      } else {
        throw new Error("Could not get a recommendation from Gemini");
      }
    } catch (err) {
      console.error("Gemini fetch error:", err);
      setAiThinking(false);
      setError("AI Search failed: " + err.message);
      setLoading(false);
    }
  }

  // ---- Music Search using YouTube API ----
  function handleMusicSearch(query) {
    if (!query.trim()) return;

    setCurrentPage("music");
    setMusicLoading(true);
    setMusicError("");
    setMusicResults([]);
    setMusicQuery(query);
    setPlayingMusicId(null);

    // Append 'official audio OR official music video' to heavily bias results towards official releases
    const enhancedQuery = query + " official audio OR official music video";
    const searchQuery = encodeURIComponent(enhancedQuery);
    const url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" +
      searchQuery +
      "&type=video&videoCategoryId=10&key=" +
      YOUTUBE_API_KEY;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMusicError(data.error.message || "YouTube API error.");
        } else if (data.items && data.items.length > 0) {
          const formatted = data.items.map((item) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high
              ? item.snippet.thumbnails.high.url
              : item.snippet.thumbnails.medium.url,
            description: item.snippet.description,
          }));
          setMusicResults(formatted);
        } else {
          setMusicError('No music found for "' + query + '"');
        }
        setMusicLoading(false);
      })
      .catch((err) => {
        console.log("Music search error:", err);
        setMusicError("Network error. Check your internet.");
        setMusicLoading(false);
      });
  }

  function toggleMusicPlay(videoId) {
    if (playingMusicId === videoId) {
      setPlayingMusicId(null);
    } else {
      setPlayingMusicId(videoId);
    }
  }

  function addMusicToMySongs(track) {
    let song = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      thumbnail: track.thumbnail,
      movieName: "Music Search",
    };
    addToMySongs(song);
  }

  // ---- watchlist and songs functions ----
  function addToWatchlist(movie) {
    // check if already in watchlist
    let exists = watchlist.find((m) => m.imdbID === movie.imdbID);
    if (exists) {
      // remove from watchlist
      setWatchlist(watchlist.filter((m) => m.imdbID !== movie.imdbID));
    } else {
      // add to watchlist (spread to create new array)
      setWatchlist([...watchlist, movie]);
    }
  }

  function isInWatchlist(movieId) {
    return watchlist.some((m) => m.imdbID === movieId);
  }

  function addToMySongs(song) {
    let exists = mySongs.find((s) => s.id === song.id);
    if (exists) {
      // remove if already there
      setMySongs(mySongs.filter((s) => s.id !== song.id));
    } else {
      // add to my songs
      setMySongs([...mySongs, song]);
    }
  }

  // ---- songs modal ----
  function showSongsForMovie(movie) {
    setSongsMovie(movie);
  }

  function closeSongsModal() {
    setSongsMovie(null);
  }

  // ---- auto search when user types (with delay) ----
  useEffect(() => {
    if (!searchQuery.trim() || aiEnabled) return;

    let timer = setTimeout(() => {
      if (currentPage === "music") {
        handleMusicSearch(searchQuery);
      } else {
        fetchMovies(searchQuery);
      }
    }, 600);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // ---- render ----
  return (
    <div className="app">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        watchlistCount={watchlist.length}
      />

      {/* show different pages based on currentPage state */}
      {(currentPage === "home" || currentPage === "music") && (
        <>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            aiEnabled={aiEnabled}
            setAiEnabled={setAiEnabled}
            onSearch={handleSearch}
            onMusicSearch={handleMusicSearch}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {aiThinking && (
            <div className="ai-thinking">
              AI is thinking... analyzing your description
            </div>
          )}
        </>
      )}

      {currentPage === "home" && (
        <div className="main-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Fetching movies...</p>
            </div>
          ) : error ? (
            <div className="error-msg">{error}</div>
          ) : movies.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">No movies to show</p>
              <p className="empty-sub">Try searching for something!</p>
            </div>
          ) : (
            <>
              <h2 className="section-title">
                {aiEnabled ? "AI Picks for You" : "Movies"}
              </h2>
              <div className="movie-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isInWatchlist={isInWatchlist(movie.imdbID)}
                    onAddWatchlist={addToWatchlist}
                    onShowSongs={showSongsForMovie}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Music Search Results - Spotify-like grid */}
      {currentPage === "music" && (
        <div className="music-page">
          {/* Embedded YouTube player at top */}
          {playingMusicId && (
            <div className="music-player-bar">
              <iframe
                width="100%"
                height="200"
                src={
                  "https://www.youtube.com/embed/" +
                  playingMusicId +
                  "?autoplay=1"
                }
                title="Now Playing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="music-content">
            {musicLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p className="loading-text">Searching music...</p>
              </div>
            ) : musicError ? (
              <div className="error-msg">{musicError}</div>
            ) : musicResults.length > 0 ? (
              <>
                <h2 className="section-title">Results for "{musicQuery}"</h2>
                <div className="music-grid">
                  {musicResults.map((track) => {
                    let isPlaying = playingMusicId === track.id;
                    let isSaved = mySongs.some((s) => s.id === track.id);

                    return (
                      <div
                        className={"music-card" + (isPlaying ? " playing" : "")}
                        key={track.id}
                      >
                        <div
                          className="music-card-thumb"
                          onClick={() => toggleMusicPlay(track.id)}
                        >
                          <img src={track.thumbnail} alt={track.title} />
                        </div>
                        <div className="music-card-info">
                          <h4
                            className="music-card-title"
                            dangerouslySetInnerHTML={{ __html: track.title }}
                          ></h4>
                          <p className="music-card-artist">{track.artist}</p>

                          <div className="music-card-actions">
                            <button
                              className={
                                "music-action-btn play-btn" +
                                (isPlaying ? " active" : "")
                              }
                              onClick={() => toggleMusicPlay(track.id)}
                            >
                              {isPlaying ? "Pause" : "Play"}
                            </button>
                            <button
                              className={
                                "music-action-btn save-btn" +
                                (isSaved ? " saved" : "")
                              }
                              onClick={() => addMusicToMySongs(track)}
                            >
                              {isSaved ? "Saved" : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p className="empty-text">Search for music</p>
                <p className="empty-sub">
                  Type something in the search bar and click Switch to Music
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {currentPage === "watchlist" && (
        <Watchlist
          watchlist={watchlist}
          onRemove={addToWatchlist}
          onShowSongs={showSongsForMovie}
          onBack={() => setCurrentPage("home")}
        />
      )}

      {currentPage === "songs" && (
        <MySongs
          mySongs={mySongs}
          onRemoveSong={addToMySongs}
          onBack={() => setCurrentPage("home")}
        />
      )}

      {/* songs modal - shows on top of everything */}
      {songsMovie && (
        <SongsModal
          movie={songsMovie}
          mySongs={mySongs}
          onAddSong={addToMySongs}
          onClose={closeSongsModal}
        />
      )}
    </div>
  );
}

export default App;
