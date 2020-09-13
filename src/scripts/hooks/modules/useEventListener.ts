import React from 'react'

export const useEventListener = (
  eventName: string,
  handler: any,
  element: HTMLElement | (Window & typeof globalThis) = window
) => {
  const savedHandler = React.useRef<EventListener>(() => {})

  React.useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  React.useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return

    const eventListener = (event: Event) => savedHandler.current(event)
    element.addEventListener(eventName, eventListener)

    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}
