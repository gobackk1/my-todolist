import { useRef, useEffect } from 'react'

/**
 * const isMounted = useMountedRef()
 *
 * if (isMounted.current) {
 *   setState(...)
 * }
 */
export const useMountedRef = () => {
  const ref = useRef(false)

  useEffect(() => {
    ref.current = true
    return () => {
      ref.current = false
    }
  }, [])

  return ref
}
