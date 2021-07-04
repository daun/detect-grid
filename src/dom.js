/**
 * Check if an element is visible
 */
export function isVisible(element) {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  )
}

/**
 * Get the x and y coordinates of an element, with configurable
 * alignment (left or right edge, center, top or bottom edge, center)
 */
export function getElementOffset(element, justify, align) {
  let x, y
  switch (justify) {
    case 'right':
      x = Math.round(element.offsetLeft + element.offsetWidth)
      break
    case 'center':
      x = Math.round(element.offsetLeft + element.offsetWidth / 2)
      break
    case 'left':
    default:
      x = Math.round(element.offsetLeft)
      break
  }
  switch (align) {
    case 'bottom':
      y = Math.round(element.offsetTop + element.offsetHeight)
      break
    case 'center':
      y = Math.round(element.offsetTop + element.offsetHeight / 2)
      break
    case 'top':
    default:
      y = Math.round(element.offsetTop)
      break
  }
  return { x, y }
}

/**
 * Set data attributes by key
 */
export function setDataAttributes(element, data) {
  Object.keys(data).forEach((attr) => {
    const val = data[attr]
    if (val === null || val === false) {
      element.removeAttribute(`data-${attr}`)
    } else if (val === true) {
      element.setAttribute(`data-${attr}`, '')
    } else {
      element.setAttribute(`data-${attr}`, val)
    }
  })
}

/**
 * Set CSS variables by key
 */
export function setCssVariables(element, data) {
  Object.keys(data).forEach((attr) => {
    const val = data[attr]
    if (val === null || val === false) {
      element.style.removeProperty(`--${attr}`)
    } else {
      element.style.setProperty(`--${attr}`, val)
    }
  })
}
