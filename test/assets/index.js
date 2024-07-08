import { detectGrid, markGrid } from 'http://localhost:5678/src/index.js'

window.detectGrid = detectGrid
window.markGrid = markGrid

window.describeGrid = (grid) =>
  grid.map((cols) => cols.map((cell) => cell.innerText.replace(/\s/g, '')))

window.getCssVariables = (grid) =>
  grid.map((cols) =>
    cols.map((cell) => {
      const text = cell.innerText.replace(/\s/g, '')
      const variables = Array.from(cell.style).reduce((acc, key) => {
        if (key.startsWith('--')) {
          acc[key] = cell.style.getPropertyValue(key)
        }
        return acc
      }, {})
      return { text, ...variables }
    })
  )
