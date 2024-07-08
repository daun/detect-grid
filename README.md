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

Returns an array of rows and columns for further processing. Indices are zero-based.

```js
import detectGrid from 'detect-grid'

const grid = document.querySelector('.grid')

const rows = detectGrid(grid)

rows.forEach((cols, rowIndex) => {
  cols.forEach((cell, colIndex) => {
    console.log(`Cell at row ${rowIndex} and col ${colIndex}`, cell.textContent)
  })
})
```

### Mark grid cells

Detects rows and columns and mark them with data attributes for CSS styling.

```js
import { markGrid } from 'detect-grid'

const grid = document.querySelector('.grid')

markGrid(grid, { selector: '.cell' })
```

**Before**

```html
<div class="grid">
  <div>
    <div class="cell"></div>
    <div class="cell"></div>
  </div>
  <div>
    <div class="cell"></div>
    <div class="cell"></div>
  </div>
</div>
```

**After**

> :warning: While the `detectGrid` function returns zero-based arrays, the data
   attributes added by `markGrid` start counting from `1` to keep compatibility
   with CSS nth-child selectors.

```html
<div class="grid">
  <div>
    <div class="cell" data-nth-row="1" data-nth-col="1" data-first-row data-first-col></div>
    <div class="cell" data-nth-row="1" data-nth-col="2" data-first-row data-last-col></div>
  </div>
  <div>
    <div class="cell" data-nth-row="2" data-nth-col="1" data-first-col></div>
    <div class="cell" data-nth-row="2" data-nth-col="2" data-last-col></div>
  </div>
  <div>
    <div class="cell" data-nth-row="2" data-nth-col="1" data-last-row data-first-col></div>
    <div class="cell" data-nth-row="2" data-nth-col="2" data-last-row data-last-col></div>
  </div>
</div>
```

### CSS variables

Some visual effects like gradients require CSS custom properties for calculating
the correct value for each row and cell. You can enable those behind an optional
feature flag when marking grid cells:

```js
markGrid(grid, { cssVariables: true })
```

You can now use the following CSS properties like `--col-fraction` or `--row-fraction`
for calculating styles:

```html
<div class="grid">
  <div>
    <div class="cell" style="--col-index: 0; --col-count: 3; --col-fraction: 0; --row-index: 0; --row-count: 2; --row-fraction: 0;"></div>
    <div class="cell" style="--col-index: 1; --col-count: 3; --col-fraction: 0.5; --row-index: 0; --row-count: 2; --row-fraction: 0;"></div>
    <div class="cell" style="--col-index: 2; --col-count: 3; --col-fraction: 1; --row-index: 0; --row-count: 2; --row-fraction: 0;"></div>
  </div>
  <div>
    <div class="cell" style="--col-index: 0; --col-count: 3; --col-fraction: 0; --row-index: 1; --row-count: 2; --row-fraction: 1;"></div>
    <div class="cell" style="--col-index: 1; --col-count: 3; --col-fraction: 0.5; --row-index: 1; --row-count: 2; --row-fraction: 1;"></div>
    <div class="cell" style="--col-index: 2; --col-count: 3; --col-fraction: 1; --row-index: 1; --row-count: 2; --row-fraction: 1;"></div>
  </div>
</div>
```

## Options

Configure how cells are detected by passing an options object as second parameter.

```js
const rows = detectGrid(grid, {
  selector: '.cell',
  align: 'bottom'
})
```

|Option|Description|Type/Options|Default|
|---|---|---|---|
|`selector`|DOM selector to find grid cells|Selector string|Use direct childnodes|
|`justify`|Horizontal alignment of measuring point|String: `left`, `center`, `right`|`left`|
|`align`|Vertical alignment of measuring point|String: `top`, `center`, `bottom`|`top`|
|`tolerance`|Tolerance to group rows/columns by|Number (px)|`0`|

## License

[MIT](https://opensource.org/licenses/MIT)
