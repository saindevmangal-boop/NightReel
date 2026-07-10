import MovieCard from './MovieCard.jsx'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll.js'

export default function MovieGrid({ movies, loading, hasMore, onLoadMore, error, emptyMessage }) {
  const sentinelRef = useInfiniteScroll({ onIntersect: onLoadMore, loading, hasMore })

  if (error) {
    return (
      <div className="state-panel state-panel--error">
        <span className="state-panel__icon">⚠</span>
        <h3>Something cut the reel</h3>
        <p>{error}</p>
      </div>
    )
  }

  if (!loading && movies.length === 0) {
    return (
      <div className="state-panel">
        <span className="state-panel__icon">🎞</span>
        <h3>Nothing here yet</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid">
        {movies.map((movie, idx) => (
          <MovieCard key={`${movie.id}-${idx}`} movie={movie} />
        ))}
      </div>

      {loading && (
        <div className="grid grid--skeleton" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="card card--skeleton" key={i}>
              <div className="card__poster shimmer" />
              <div className="card__info">
                <div className="skeleton-line shimmer" />
                <div className="skeleton-line skeleton-line--short shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="sentinel" aria-hidden="true" />}
    </>
  )
}