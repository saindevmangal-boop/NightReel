import { useEffect, useState } from 'react'

/**
 * Returns a debounced copy of `value` that only updates once the caller
 * has stopped changing it for `delay` ms. Used to stop the search bar
 * from firing an HTTP request on every keystroke.
 */
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}