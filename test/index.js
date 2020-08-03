/* global detectGrid, markGrid */

import { assert } from 'chai'
import playwright from 'playwright'

const { chromium } = playwright

import createServer from './helpers/server'

import { default as Library } from '../src'

const TEST_SERVER = `http://localhost:5000`
const TEST_URL = `${TEST_SERVER}/test/assets/index.html`
const TEST_STYLE = `${TEST_SERVER}/test/assets/index.css`
const TEST_SCRIPT = `${TEST_SERVER}/test/assets/index.mjs`

let page, browser, context
let stack, flex, grid

describe('Library', function () {
  it('exports a function', () => {
    assert(typeof Library === 'function')
  })
})

describe('detect-grid', () => {
  before(function () {
    this.server = createServer()
  })

  after(function () {
    this.server()
  })

  beforeEach(async () => {
    browser = await chromium.launch({ headless: false })
    context = await browser.newContext()
    page = await context.newPage()

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
  })

  afterEach(async function () {
    await browser.close()
  })

  describe('detectGrid', () => {
    it('returns an array of arrays', async () => {
      const result = await stack.evaluate((node) => detectGrid(node))
      assert(Array.isArray(result))
      assert(Array.isArray(result[0]))
    })

    it('detects stack cells', async () => {
      const result = await stack.evaluate((node) => {
        const detected = detectGrid(node)
        const numbers = detected.map((cols) =>
          cols.map((cell) => cell.innerHTML)
        )
        return numbers
      })

      assert.deepEqual(result, [['2'], ['1'], ['3'], ['4']])
    })

    it('detects flex cells', async () => {
      const result = await flex.evaluate((node) => {
        const detected = detectGrid(node)
        const numbers = detected.map((cols) =>
          cols.map((cell) => cell.innerHTML)
        )
        return numbers
      })

      assert.deepEqual(result, [['2', '1', '3', '4']])
    })

    it('detects grid cells', async () => {
      const result = await grid.evaluate((node) => {
        const detected = detectGrid(node, { selector: '.col' })
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
      await grid.evaluate((node) => markGrid(node))
      const htmlAfter = await grid.evaluate((node) => node.innerHTML)

      assert(htmlBefore !== htmlAfter)
    })
  })
})
