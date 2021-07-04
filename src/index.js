import { isVisible, getElementOffset, setDataAttributes } from './dom.js'

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

  return objectToSortedArray(rows).map((cells) => objectToSortedArray(cells))
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

/**
 * Sort object by key and convert to array
 */
function objectToSortedArray(obj) {
  return Object.keys(obj)
    .map(Number)
    .sort((a, b) => a - b)
    .map((key) => obj[key])
    .flat()
}

export default detectGrid
