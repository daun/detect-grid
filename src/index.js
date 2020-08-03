/**
 * Detect grid rows and cols from element offsets
 */
export function detectGrid(element, { selector = null } = {}) {
  const items = selector ? element.querySelectorAll(selector) : element.children
  const visibleItems = Array.from(items).filter(isVisible)
  const rows = {}

  visibleItems.forEach((cell) => {
    const top = Math.round(cell.offsetTop)
    const left = Math.round(cell.offsetLeft)
    rows[top] = rows[top] || {}
    rows[top][left] = rows[top][left] || []
    rows[top][left].push(cell)
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
        row: rowIndex + 1,
        'first-row': rowIndex === 0,
        'last-row': rowIndex === rows.length - 1,
        col: colIndex + 1,
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

export default detectGrid
