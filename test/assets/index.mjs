import { detectGrid, markGrid } from 'http://localhost:5000/src/index.js'

window.detectGrid = detectGrid
window.markGrid = markGrid

window.describeGrid = (grid) =>
  grid.map((cols) => cols.map((cell) => cell.innerText.replace(/\s/g, '')))
