/**
 * Detect grid rows and cols from element offsets
 */
export function detectGrid(
  element,
  { selector = null, justify = null, align = null, tolerance = 0 } = {}
) {
  const items = selector ? element.querySelectorAll(selector) : element.children
  const visibleItems = Array.from(items).filter(isVisible)
  const rows = {}

  visibleItems.forEach((cell) => {
    let { x, y } = getElementOffset(cell, justify, align)
    y = getClosestNumericalKey(rows, y, tolerance)
    rows[y] = rows[y] || {}
    x = getClosestNumericalKey(rows[y], x, tolerance)
    rows[y][x] = rows[y][x] || []
    rows[y][x].push(cell)
  })

  return Object.keys(rows)
    .map(Number)
    .sort((a, b) => a - b)
    .map((offset) => {
      const cells = rows[offset]
      return Object.keys(cells)
        .map(Number)
        .sort((a, b) => a - b)
        .map((offset) => cells[offset])
        .flat()
    })
}

/**
 * Mark grid rows and cols with data attributes for styling
 */
export function markGrid(el, options = {}) {
  const rows = detectGrid(el, options)

  rows.forEach((cols, rowIndex) => {
    cols.forEach((cell, colIndex) => {
      setDataAttributes(cell, {
        'nth-row': rowIndex + 1,
        'first-row': rowIndex === 0,
        'last-row': rowIndex === rows.length - 1,
        'nth-col': colIndex + 1,
        'first-col': colIndex === 0,
        'last-col': colIndex === cols.length - 1,
        'single-col': cols.length === 1
      })
    })
  })
}

/**
 * Check if an element is visible
 */
function isVisible(element) {
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
function getElementOffset(element, justify, align) {
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
function setDataAttributes(element, data) {
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
 * Find a numerical key of an object within a tolerance span
 */
function getClosestNumericalKey(items, key, tolerance = 0) {
  for (let i = 1; i <= tolerance; i++) {
    if (items[key + i]) {
      return key + i
    }
    if (items[key - i]) {
      return key - i
    }
  }
  return key
}

export default detectGrid
