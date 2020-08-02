import { assert } from 'chai'

import detectGrid from '../src'

describe('Library', function () {
  it('exports a function', () => {
    assert(typeof detectGrid === 'function')
  })
})
