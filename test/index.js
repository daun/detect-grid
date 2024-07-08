/* global detectGrid, markGrid, describeGrid, getCssVariables */

import { assert } from 'chai'
import playwright from 'playwright'

const { chromium } = playwright

import createServer from './helpers/server.js'

import { default as Library } from '../src/index.js'

const TEST_SERVER = 'http://localhost:5678'
const TEST_URL = `${TEST_SERVER}/test/assets/index.html`
const TEST_STYLE = `${TEST_SERVER}/test/assets/index.css`
const TEST_SCRIPT = `${TEST_SERVER}/test/assets/index.js`
const TEST_SIZE_MULTICOL = { width: 640, height: 480 }
// const TEST_SIZE_SINGLECOL = { width: 320, height: 480 }

let page, browser, context
let stack, flex
let grid, gridLarge, gridNested, gridTop, gridMiddle, gridBottom, gridOffset

describe('Library', function () {
  it('exports a function', () => {
    assert(typeof Library === 'function')
  })
})

describe('detect-grid', () => {
  before(async function () {
    this.server = createServer()
    browser = await chromium.launch({ headless: true })
  })

  after(async function () {
    await browser.close()
    this.server()
  })

  beforeEach(async () => {
    context = await browser.newContext()
    page = await context.newPage()
    await page.setViewportSize(TEST_SIZE_MULTICOL)

    page.on('console', (msg) => console.log(msg.text()))
    page.on('pageerror', (exception) => {
      console.log(`Uncaught exception: "${exception}"`)
    })

    await page.goto(TEST_URL)
    await page.addStyleTag({ url: TEST_STYLE })
    await page.addScriptTag({ url: TEST_SCRIPT, type: 'module' })
    await page.waitForLoadState('networkidle')

    stack = await page.$('.stack')
    flex = await page.$('.flex')
    grid = await page.$('.grid')
    gridLarge = await page.$('.grid-large')
    gridNested = await page.$('.grid-nested')
    gridTop = await page.$('.grid-top')
    gridMiddle = await page.$('.grid-middle')
    gridBottom = await page.$('.grid-bottom')
    gridOffset = await page.$('.grid-offset')
  })

  afterEach(async function () {
    await context.close()
  })

  describe('detectGrid', () => {
    it('returns an array of arrays', async () => {
      const result = await stack.evaluate((node) => detectGrid(node))
      assert(Array.isArray(result))
      assert(Array.isArray(result[0]))
    })

    it('detects stack cells', async () => {
      const result = await stack.evaluate(async (node) => {
        return describeGrid(detectGrid(node))
      })

      assert.deepEqual(result, [['2'], ['1'], ['3'], ['4']])
    })

    it('detects flex cells', async () => {
      const result = await flex.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })

      assert.deepEqual(result, [['2', '1', '3', '4']])
    })

    it('detects grid cells', async () => {
      const result = await grid.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })

      assert.deepEqual(result, [
        ['2', '1'],
        ['3', '4']
      ])
    })

    it('detects large grid cells', async () => {
      const result = await gridLarge.evaluate((node) => {
        return describeGrid(detectGrid(node, { selector: '.cell' }))
      })

      assert.deepEqual(result, [
        ['2', '1', '4', '5', '6'],
        ['7', '3']
      ])
    })

    it('detects nested grid cells', async () => {
      const result = await gridNested.evaluate((node) => {
        return describeGrid(detectGrid(node, { selector: '.cell' }))
      })

      assert.deepEqual(result, [
        ['2', '1'],
        ['3', '4']
      ])
    })

    it('detects top alignment by default', async () => {
      const result = await gridTop.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })

      assert.deepEqual(result, [
        ['1', '22'],
        ['333', '4444']
      ])
    })

    it('detects center alignment', async () => {
      const wrongResult = await gridMiddle.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })
      const result = await gridMiddle.evaluate((node) => {
        return describeGrid(detectGrid(node, { align: 'center' }))
      })

      assert.deepEqual(wrongResult, [['22'], ['1'], ['4444'], ['333']])
      assert.deepEqual(result, [
        ['1', '22'],
        ['333', '4444']
      ])
    })

    it('detects bottom alignment', async () => {
      const wrongResult = await gridMiddle.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })
      const result = await gridBottom.evaluate((node) => {
        return describeGrid(detectGrid(node, { align: 'bottom' }))
      })

      assert.deepEqual(wrongResult, [['22'], ['1'], ['4444'], ['333']])
      assert.deepEqual(result, [
        ['1', '22'],
        ['333', '4444']
      ])
    })

    it('applies tolerance', async () => {
      const wrongResult = await gridOffset.evaluate((node) => {
        return describeGrid(detectGrid(node))
      })
      const result = await gridOffset.evaluate((node) => {
        return describeGrid(detectGrid(node, { tolerance: 1 }))
      })

      assert.deepEqual(wrongResult, [['2'], ['1'], ['4'], ['3']])
      assert.deepEqual(result, [
        ['1', '2'],
        ['3', '4']
      ])
    })
  })

  describe('markGrid', () => {
    it('modifies the element', async () => {
      const htmlBefore = await grid.evaluate((node) => node.innerHTML)
      await grid.evaluate((node) => markGrid(node))
      const htmlAfter = await grid.evaluate((node) => node.innerHTML)

      assert(htmlBefore !== htmlAfter)
    })

    it('does not add css variables by default', async () => {
      await gridLarge.evaluate((node) => markGrid(node))
      const result = await gridLarge.evaluate((node) =>
        getCssVariables(detectGrid(node))
      )
      assert.deepEqual(result, [
        [
          { text: '2' },
          { text: '1' },
          { text: '4' },
          { text: '5' },
          { text: '6' }
        ],
        [{ text: '7' }, { text: '3' }]
      ])
    })

    it('adds css variables', async () => {
      await gridLarge.evaluate((node) => markGrid(node, { cssVariables: true }))
      const result = await gridLarge.evaluate((node) =>
        getCssVariables(detectGrid(node))
      )
      assert.deepEqual(result, [
        [
          {
            text: '2',
            '--row-count': '2',
            '--row-index': '0',
            '--row-fraction': '0',
            '--col-count': '5',
            '--col-count-max': '5',
            '--col-index': '0',
            '--col-fraction': '0',
            '--col-fraction-max': '0'
          },
          {
            text: '1',
            '--row-count': '2',
            '--row-index': '0',
            '--row-fraction': '0',
            '--col-count': '5',
            '--col-count-max': '5',
            '--col-index': '1',
            '--col-fraction': '0.25',
            '--col-fraction-max': '0.25'
          },
          {
            text: '4',
            '--row-count': '2',
            '--row-index': '0',
            '--row-fraction': '0',
            '--col-count': '5',
            '--col-count-max': '5',
            '--col-index': '2',
            '--col-fraction': '0.5',
            '--col-fraction-max': '0.5'
          },
          {
            text: '5',
            '--row-count': '2',
            '--row-index': '0',
            '--row-fraction': '0',
            '--col-count': '5',
            '--col-count-max': '5',
            '--col-index': '3',
            '--col-fraction': '0.75',
            '--col-fraction-max': '0.75'
          },
          {
            text: '6',
            '--row-count': '2',
            '--row-index': '0',
            '--row-fraction': '0',
            '--col-count': '5',
            '--col-count-max': '5',
            '--col-index': '4',
            '--col-fraction': '1',
            '--col-fraction-max': '1'
          }
        ],
        [
          {
            text: '7',
            '--row-count': '2',
            '--row-index': '1',
            '--row-fraction': '1',
            '--col-count': '2',
            '--col-count-max': '5',
            '--col-index': '0',
            '--col-fraction': '0',
            '--col-fraction-max': '0'
          },
          {
            text: '3',
            '--row-count': '2',
            '--row-index': '1',
            '--row-fraction': '1',
            '--col-count': '2',
            '--col-count-max': '5',
            '--col-index': '1',
            '--col-fraction': '1',
            '--col-fraction-max': '0.25'
          }
        ]
      ])
    })
  })
})
