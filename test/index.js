import path from 'path'
import { assert, expect } from 'chai'
import playwright from 'playwright'

import detectGrid, { markGrid } from '../src'

const { chromium } = playwright

const file = path.join(__dirname, 'index.html')
const url = `file:${file}`

const libraryScript = path.join(__dirname, '..', 'dist', 'index.umd.js')

let page, browser, context

describe('Library', function () {
  it('exports a function', () => {
    assert(typeof detectGrid === 'function')
  })
})

describe('detectGrid', () => {
  beforeEach(async () => {
    browser = await chromium.launch()
    context = await browser.newContext()
    page = await context.newPage()
    await page.addInitScript(libraryScript)
    await page.goto(url)
    await page.waitForLoadState('networkidle')
  })

  afterEach(async function () {
    await browser.close()
  })

  it('Grid is found', async () => {
    const grids = await page.$$('.grid')
    expect(grids.length).to.equal(1)
  })

  it('Grid has children', async () => {
    const gridHtml = await page.$eval('.grid', (node) => node.innerHTML)
    expect(gridHtml).to.include('class="col"')
  })
})
