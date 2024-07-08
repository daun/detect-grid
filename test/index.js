/* global detectGrid, markGrid, describeGrid */

import { assert } from 'chai'
import playwright from 'playwright'

const { chromium } = playwright

import createServer from './helpers/server.js'

import { default as Library } from '../src/index.js'

const TEST_SERVER = `http://localhost:5000`
const TEST_URL = `${TEST_SERVER}/test/assets/index.html`
const TEST_STYLE = `${TEST_SERVER}/test/assets/index.css`
const TEST_SCRIPT = `${TEST_SERVER}/test/assets/index.mjs`
const TEST_SIZE_MULTICOL = { width: 640, height: 480 }
// const TEST_SIZE_SINGLECOL = { width: 320, height: 480 }

let page, browser, context
let stack, flex, grid, nested, gridTop, gridMiddle, gridBottom, gridOffset

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
    nested = await page.$('.nested')
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

    it('detects nested cells', async () => {
      const result = await nested.evaluate((node) => {
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

    it('adds css custom properties', async () => {
      await grid.evaluate((node) => markGrid(node))
      const htmlAfter = await grid.evaluate((node) => node.innerHTML)

      assert(htmlAfter.includes('--row-index:'), 'Row index property not found')
      assert(htmlAfter.includes('--col-index:'), 'Col index property not found')
    })
  })
})
