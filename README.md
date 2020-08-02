# Detect Grid

[![NPM version](https://img.shields.io/npm/v/detect-grid)](https://www.npmjs.com/package/detect-grid)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/detect-grid?label=size)](https://bundlephobia.com/result?p=detect-grid)
[![GitHub license](https://img.shields.io/github/license/daun/detect-grid)](./LICENSE)

Detect and mark grid cells for easy styling.

## What does it do?

This package detects the rows and columns of a layout visually by comparing the
offset from the top-left edge of the parent container. Each element is assigned
a row and column index.

It will mark each detected cell with data attributes for easy targeting in CSS.
This makes styling cells by index feasible even in flexbox or grid layouts where
visual position doesn't always follow source order.

## Installation

```bash
npm install detect-grid
```

## Usage

### Detect grid cells

Returns an array of rows and columns for further processing.

```js
import detectGrid from 'detect-grid'

const grid = document.querySelector('.grid')

const rows = detectGrid(grid)

rows.forEach((cols, row) => {
  cols.forEach((cell, col) => {
    console.log(
      `Cell at row ${row} and col ${col}`,
      cell.textContent
    )
  })
})
```

### Mark grid cells

Detects rows and columns and mark them with data attributes for CSS styling.

```js
import { markGrid } from 'detect-grid'

const grid = document.querySelector('.grid')

markGrid(grid, { selector: '.col' })
```

**Before**

```html
<div class="grid">
  <div>
    <div class="col"></div>
    <div class="col"></div>
  </div>
  <div>
    <div class="col"></div>
    <div class="col"></div>
  </div>
</div>
```

**After**

```html
<div class="grid">
  <div>
    <div class="col" data-row="0" data-col="0" data-first-row data-first-col></div>
    <div class="col" data-row="0" data-col="1" data-first-row data-last-col></div>
  </div>
  <div>
    <div class="col" data-row="1" data-col="0" data-first-col></div>
    <div class="col" data-row="1" data-col="1" data-last-col></div>
  </div>
  <div>
    <div class="col" data-row="2" data-col="0" data-last-row data-first-col></div>
    <div class="col" data-row="2" data-col="1" data-last-row data-last-col></div>
  </div>
</div>
```

## License

[MIT](https://opensource.org/licenses/MIT)
