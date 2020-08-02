/**
 * Detect grid rows and cols from element offsets
 */
export default function detectGrid(
  element,
  { selector = null, side = 'offsetTop' } = {}
) {
  const items = selector ? element.querySelectorAll(selector) : element.children
  const visibleItems = [...items].filter(isVisible)
  const cells = {}

  visibleItems.forEach((w) => {
    const offset = Math.round(w[side])
    ;(cells[offset] || (cells[offset] = [])).push(w)
  })

  return Object.keys(cells)
    .map(Number)
    .sort((a, b) => a - b)
    .map((offset) => cells[offset])
}

/**
 * Mark grid rows and cols with data attributes for styling
 */
export function markGrid(el) {
  const rows = detectGrid(el)

  rows.forEach((cols, rowIndex) => {
    cols.forEach((cell, colIndex) => {
      setDataAttributes(cell, {
        row: rowIndex,
        'first-row': rowIndex === 0,
        'last-row': rowIndex === rows.length - 1,
        col: colIndex,
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
 * Set data attributes by key
 */
function setDataAttributes(element, data) {
  Object.keys(data).forEach((attr) => {
    element.setAttribute(`data-${attr}`, data[attr])
  })
}
