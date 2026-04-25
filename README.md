# Decibel

**Decibel** is a premium, dual-engine entertainment discovery platform. Built with React and Vite, it merges the professional aesthetics of **IMDb** for movie tracking with the sleek utility of **Spotify** for music discovery. 

Whether you're looking for high-quality official music tracks or using AI to find a movie based on a specific "vibe," Decibel provides a seamless, SPA (Single Page Application) experience.

---

##  Features

### The Movie Engine (IMDb Theme)
- **Curated Trending Feed:** Instantly loads a hand-picked selection of highly-rated modern classics to get you started.
- **AI-Powered Search (Gemini 2.5 Flash):** Toggle "AI Search" to find movies by describing their plot, mood, or "vibes" (e.g., *"A movie about time travel and love"*).
- **Comprehensive Metadata:** Powered by the **OMDB API**, each movie card displays ratings, release years, genres, and high-quality posters.
- **Personal Watchlist:** Save movies to your session-based Watchlist for later viewing.
- **IMDb Aesthetic:** A dark `#121212` canvas with sharp, professional yellow (`#f5c518`) accents and hover effects.

### The Music Engine (Spotify Theme)
- **Official Audio Search:** Powered by the **YouTube Data API v3**, all music searches automatically filter for "official audio" or "official music video" to ensure high-quality studio tracks over fan-made content.
- **Spotify Aesthetic:** Smooth, deep black cards with vibrant green (`#1db954`) active states and clean action buttons.
- **Persistent Playback:** An integrated YouTube player bar expands at the top of the music page, allowing you to listen to tracks while continuing your search.
- **Movie Soundtrack Integration:** Directly search for any movie's official soundtrack without leaving the movie page via the `SongsModal`.
- **My Songs Collection:** Save your favorite tracks to a dedicated "My Songs" list.

---

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Pure Vanilla CSS (No Tailwind or external component libraries)
- **APIs:** 
  - **OMDB API** (Movie Data)
  - **YouTube Data API v3** (Music & Video Playback)
  - **Google Gemini API** (AI Plot-based Searching)
- **State Management:** React Hooks (`useState`, `useEffect`) - *Fully session-based (No localStorage).*

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need to acquire API keys for OMDB, YouTube, and Gemini.

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Moviedecibel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root of the project and add your API keys:
   ```env
   OMDB_API=your_omdb_api_key_here
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: The OMDB variable name is specifically configured as `OMDB_API` to match the `import.meta.env.OMDB_API` reference in the code).*

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

---

## Design Philosophy
This project was built adhering to a strict foundational React syllabus. It avoids heavy third-party routing or UI libraries to demonstrate a deep understanding of core React hooks, conditional rendering, state lifting, and pure CSS architecture. 

The UI relies heavily on modern design principles: glassmorphism, responsive CSS Grid layouts, and dynamic theme switching based on the user's current context (Movie vs. Music).

---
