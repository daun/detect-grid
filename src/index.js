import { getClosestNumericalKey, objectToSortedArray } from './objects.js'
import {
  isVisible,
  getElementOffset,
  setDataAttributes,
  setCssVariables
} from './dom.js'

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
      setCssVariables(cell, {
        'row-index': rowIndex,
        'col-index': colIndex
      })
    })
  })
}

export default detectGrid
