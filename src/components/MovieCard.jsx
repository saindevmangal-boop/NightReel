import { getImageUrl, getReleaseYear } from '../api/tmdb.js'
import { useFavorites } from '../context/FavoritesContext.jsx'

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(movie.id)
  const poster = getImageUrl(movie.poster_path, 'w500')
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null

  return (
    <article className="card">
      <div className="card__poster-wrap">
        {poster ? (
          <img
            className="card__poster"
            src={poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="card__poster card__poster--placeholder">
            <span>🎬</span>
            <p>No artwork</p>
          </div>
        )}

        <button
          className={`card__heart ${fav ? 'card__heart--active' : ''}`}
          onClick={() => toggleFavorite(movie)}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${movie.title} from My List` : `Add ${movie.title} to My List`}
        >
          {fav ? '♥' : '♡'}
        </button>

        {rating && (
          <div className="card__stub">
            <span className="card__stub-star">★</span>
            <span>{rating}</span>
          </div>
        )}

        <div className="card__overlay">
          <p className="card__overview">
            {movie.overview ? movie.overview.slice(0, 140) + (movie.overview.length > 140 ? '…' : '') : 'No synopsis available.'}
          </p>
        </div>
      </div>

      <div className="card__info">
        <h3 className="card__title" title={movie.title}>{movie.title}</h3>
        <span className="card__year">{getReleaseYear(movie.release_date)}</span>
      </div>
    </article>
  )
}