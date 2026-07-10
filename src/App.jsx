import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import MovieGrid from './components/MovieGrid.jsx'
import MoodMatcher from './components/MoodMatcher.jsx'
import { useDebounce } from './hooks/useDebounce.js'
import { fetchPopularMovies, searchMovies } from './api/tmdb.js'
import { useFavorites } from './context/FavoritesContext.jsx'

export default function App() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)

  const [view, setView] = useState('browse') // 'browse' | 'favorites'
  const [moodMatcherOpen, setMoodMatcherOpen] = useState(false)

  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { favorites } = useFavorites()

  const requestToken = useRef(0)

  const isSearchMode = debouncedQuery.trim().length > 0

  const loadPage = useCallback(
    async (pageToLoad, { reset }) => {
      const token = ++requestToken.current
      setLoading(true)
      setError(null)
      try {
        const data = isSearchMode
          ? await searchMovies(debouncedQuery.trim(), pageToLoad)
          : await fetchPopularMovies(pageToLoad)

        if (token !== requestToken.current) return

        setTotalPages(data.total_pages || 1)
        setPage(data.page || pageToLoad)
        setMovies((prev) => (reset ? data.results : [...prev, ...data.results]))
      } catch (err) {
        if (token !== requestToken.current) return
        setError(err.message)
      } finally {
        if (token === requestToken.current) setLoading(false)
      }
    },
    [isSearchMode, debouncedQuery]
  )

  useEffect(() => {
    setMovies([])
    loadPage(1, { reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  const handleLoadMore = useCallback(() => {
    if (loading || page >= totalPages) return
    loadPage(page + 1, { reset: false })
  }, [loading, page, totalPages, loadPage])

  function handleMoodMatched(title) {
    setMoodMatcherOpen(false)
    setView('browse')
    setQuery(title)
  }

  const displayedMovies = view === 'favorites' ? favorites : movies
  const hasMore = view === 'browse' && page < totalPages

  return (
    <div className="app">
      <Navbar
        query={query}
        onQueryChange={(q) => {
          setQuery(q)
          if (view === 'favorites') setView('browse')
        }}
        view={view}
        onViewChange={setView}
        onMoodMatcherToggle={() => setMoodMatcherOpen((v) => !v)}
        moodMatcherOpen={moodMatcherOpen}
      />

      {moodMatcherOpen && (
        <MoodMatcher onMatched={handleMoodMatched} onClose={() => setMoodMatcherOpen(false)} />
      )}

      <main className="main">
        <div className="main__heading">
          <h1>
            {view === 'favorites'
              ? 'My List'
              : isSearchMode
              ? `Results for “${debouncedQuery.trim()}”`
              : 'Popular Right Now'}
          </h1>
          <span className="main__count">
            {view === 'favorites' ? favorites.length : movies.length} title{(view === 'favorites' ? favorites.length : movies.length) === 1 ? '' : 's'}
          </span>
        </div>

        <MovieGrid
          movies={displayedMovies}
          loading={view === 'browse' && loading}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          error={view === 'browse' ? error : null}
          emptyMessage={
            view === 'favorites'
              ? 'Tap the heart on any title to save it here.'
              : 'Try a different title, or clear your search.'
          }
        />
      </main>

      <footer className="footer">
        <p>Built with the TMDB API · Data provided for demo purposes only.</p>
      </footer>
    </div>
  )
}