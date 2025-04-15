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
export function markGrid(
  el,
  { dataAttrs = true, cssVariables = false, oddEven = false, ...options } = {}
) {
  const rows = detectGrid(el, options)

  const rowCount = rows.length
  let colCount = 0
  let colCountMax = 0

  rows.forEach((cols, rowIndex) => {
    colCount = cols.length
    colCountMax = Math.max(colCountMax, colCount)

    cols.forEach((cell, colIndex) => {
      if (dataAttrs) {
        setDataAttributes(cell, {
          'nth-row': rowIndex + 1,
          'first-row': rowIndex === 0,
          'last-row': rowIndex === rowCount - 1,
          'single-row': rowCount === 1,
          'nth-col': colIndex + 1,
          'first-col': colIndex === 0,
          'last-col': colIndex === colCount - 1,
          'single-col': colCount === 1
        })
        if (oddEven) {
          setDataAttributes(cell, {
            'odd-row': rowIndex % 2 === 0,
            'even-row': rowIndex % 2 === 1,
            'odd-col': colIndex % 2 === 0,
            'even-col': colIndex % 2 === 1,
          })
        }
      }
      if (cssVariables) {
        setCssVariables(cell, {
          'row-count': rowCount,
          'row-index': rowIndex,
          'row-fraction': rowIndex / (rowCount - 1),
          'col-count': colCount,
          'col-count-max': colCountMax,
          'col-index': colIndex,
          'col-fraction': colIndex / (colCount - 1),
          'col-fraction-max': colIndex / (colCountMax - 1)
        })
        if (oddEven) {
          setCssVariables(cell, {
            'row-odd': 1 - (rowIndex % 2),
            'row-even': rowIndex % 2,
          })
        }
      }
    })
  })
}

export default detectGrid
