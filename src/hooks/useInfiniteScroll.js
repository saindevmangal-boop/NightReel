import { useCallback, useRef } from 'react'

/**
 * Returns a ref callback to attach to a "sentinel" element at the bottom
 * of a list. When that sentinel scrolls into view, `onIntersect` fires
 * (as long as we're not already loading and more pages exist).
 */
export function useInfiniteScroll({ onIntersect, loading, hasMore }) {
  const observerRef = useRef(null)

  const sentinelRef = useCallback(
    (node) => {
      if (loading) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            onIntersect()
          }
        },
        { rootMargin: '400px' }
      )

      if (node) observerRef.current.observe(node)
    },
    [loading, hasMore, onIntersect]
  )

  return sentinelRef
}