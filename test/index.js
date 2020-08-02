import path from 'path'
import { assert, expect } from 'chai'
import playwright from 'playwright'
const { chromium } = playwright

import { default as Library } from '../src'

const TEST_FILE = path.join(__dirname, 'assets', 'index.html')
const TEST_URL = `file:${TEST_FILE}`
const TEST_SCRIPT = path.join(__dirname, '..', 'dist', 'index.umd.js')

let page, browser, context
let stack, flex, grid

describe('Library', function () {
  it('exports a function', () => {
    assert(typeof Library === 'function')
  })
})

describe('detect-grid', () => {
  beforeEach(async () => {
    browser = await chromium.launch({ headless: false })
    context = await browser.newContext()
    page = await context.newPage()

    page.on('console', (msg) => console.log(msg.text()))
    page.on('pageerror', (exception) => {
      console.log(`Uncaught exception: "${exception}"`)
    })

    await page.goto(TEST_URL)
    // await page.addScriptTag({ content: TEST_SCRIPT })
    await page.addInitScript(TEST_SCRIPT)
    await page.waitForLoadState('networkidle')

    stack = await page.$('.stack')
    flex = await page.$('.flex')
    grid = await page.$('.grid')
  })

  afterEach(async function () {
    await browser.close()
  })

  describe('detectGrid', () => {
    it('returns an array of arrays', async () => {
      const result = await stack.evaluate((node) => detectGrid.detectGrid(node))
      assert(Array.isArray(result))
      assert(Array.isArray(result[0]))
    })

    it('detects stack cells', async () => {
      const result = await stack.evaluate((node) => {
        const detected = detectGrid.detectGrid(node)
        const numbers = detected.map((cols) =>
          cols.map((cell) => cell.innerHTML)
        )
        return numbers
      })

      assert.deepEqual(result, [['2'], ['1'], ['3'], ['4']])
    })

    it('detects flex cells', async () => {
      const result = await flex.evaluate((node) => {
        const detected = detectGrid.detectGrid(node)
        const numbers = detected.map((cols) =>
          cols.map((cell) => cell.innerHTML)
        )
        return numbers
      })

      assert.deepEqual(result, [['2', '1', '3', '4']])
    })

    it('detects grid cells', async () => {
      const result = await grid.evaluate((node) => {
        const detected = detectGrid.detectGrid(node, { selector: '.col' })
        const numbers = detected.map((cols) =>
          cols.map((cell) => cell.innerHTML)
        )
        return numbers
      })

      assert.deepEqual(result, [
        ['2', '1'],
        ['3', '4']
      ])
    })
  })

  describe('markGrid', () => {
    it('modifies the element', async () => {
      const htmlBefore = await grid.evaluate((node) => node.innerHTML)
      await grid.evaluate((node) => detectGrid.markGrid(node))
      const htmlAfter = await grid.evaluate((node) => node.innerHTML)

      assert(htmlBefore !== htmlAfter)
    })
  })
})
