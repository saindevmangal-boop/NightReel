import { useFavorites } from '../context/FavoritesContext.jsx'

export default function Navbar({
  query,
  onQueryChange,
  view,
  onViewChange,
  onMoodMatcherToggle,
  moodMatcherOpen
}) {
  const { favorites } = useFavorites()

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="brand" onClick={() => onViewChange('browse')} role="button" tabIndex={0}>
          <span className="brand__reel" aria-hidden="true">◎</span>
          <span className="brand__word">NIGHT<span className="brand__accent">REEL</span></span>
        </div>

        <div className="navbar__search">
          <svg className="navbar__search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search titles, e.g. Interstellar…"
            aria-label="Search movies"
          />
          {query && (
            <button className="navbar__clear" onClick={() => onQueryChange('')} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <nav className="navbar__actions">
          <button
            className={`pill-btn ${moodMatcherOpen ? 'pill-btn--active' : ''}`}
            onClick={onMoodMatcherToggle}
          >
            <span aria-hidden="true">✦</span> Mood Matcher
          </button>
          <button
            className={`pill-btn ${view === 'favorites' ? 'pill-btn--active' : ''}`}
            onClick={() => onViewChange(view === 'favorites' ? 'browse' : 'favorites')}
          >
            <span aria-hidden="true">♥</span> My List
            {favorites.length > 0 && <span className="pill-btn__count">{favorites.length}</span>}
          </button>
        </nav>
      </div>
    </header>
  )
}