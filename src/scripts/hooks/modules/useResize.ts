export const useResize = (component, labelRef) => {
  /**
   * input: 横にリサイズ
   * textarea: 縦にリサイズ
   */
  const resize = () => {
    const inputStyles = getComputedStyle(labelRef.current!)
    if (!inputStyles) return

    if (component === 'input') {
      const span = document.createElement('span')
      span.innerHTML = labelRef.current!.value
      span.style.padding = inputStyles.padding
      span.style.fontFamily = inputStyles.fontFamily
      span.style.fontSize = inputStyles.fontSize
      span.style.fontWeight = inputStyles.fontWeight
      span.style.letterSpacing = inputStyles.letterSpacing
      span.style.boxSizing = inputStyles.boxSizing
      span.style.whiteSpace = 'nowrap'
      span.style.visibility = 'hidden'
      span.style.border = inputStyles.border

      document.body.appendChild(span)
      const spanWidth = span.offsetWidth
      document.body.removeChild(span)
      labelRef.current!.style.width = `${spanWidth + 4}px`
    } else {
      const span = document.createElement('span')
      span.innerHTML = labelRef.current!.value
      span.style.padding = inputStyles.padding
      span.style.fontFamily = inputStyles.fontFamily
      span.style.fontSize = inputStyles.fontSize
      span.style.fontWeight = inputStyles.fontWeight
      span.style.letterSpacing = inputStyles.letterSpacing
      span.style.lineHeight = inputStyles.lineHeight
      span.style.width = inputStyles.width
      span.style.boxSizing = inputStyles.boxSizing
      span.style.border = inputStyles.border
      span.style.visibility = 'hidden'
      span.style.whiteSpace = 'break-spaces'
      span.style.wordBreak = 'break-all'
      span.style.background = '#f3f3f3'
      span.style.display = 'block'
      document.body.appendChild(span)
      const spanHeight = span.offsetHeight
      document.body.removeChild(span)
      labelRef.current!.style.height = `${spanHeight}px`
    }
  }

  return { resize }
}
