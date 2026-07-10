const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

function assertKey() {
  if (!API_KEY) {
    throw new Error(
      'Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.'
    )
  }
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.status_message || `TMDB request failed (${res.status})`)
  }
  return res.json()
}

/** Fetch a page of the "Popular Movies" endpoint. */
export async function fetchPopularMovies(page = 1) {
  assertKey()
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=en-US`)
  return handle(res)
}

/** Search movies by title, paginated. */
export async function searchMovies(query, page = 1) {
  assertKey()
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US&include_adult=false`
  )
  return handle(res)
}

/** Build a full poster/backdrop image URL from a TMDB path. */
export function getImageUrl(path, size = 'w500') {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getReleaseYear(dateStr) {
  if (!dateStr) return '—'
  const year = dateStr.split('-')[0]
  return year || '—'
}