import { useRef, useEffect } from 'react'

/**
 * const isMounted = useMountedRef()
 *
 * if (isMounted) {
 *   setState(...)
 * }
 */
export const useMountedRef = (): boolean => {
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])

  return ref.current
}
