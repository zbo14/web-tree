'use strict'

const assert = require('assert')
const Domain = require('../../lib/domain')

describe('lib/domain', () => {
  beforeEach(() => {
    this.domain = new Domain()
  })

  describe('#toString()', () => {
    it('alphabetizes subdomains when stringifying', () => {
      this.domain.setSubdomain(['foo'])
      this.domain.setSubdomain(['baz'])
      this.domain.setSubdomain(['fob'])
      this.domain.setSubdomain(['bar'])

      const result = this.domain.toString(0)

      assert.strictEqual(result, [
        '.bar',
        '.baz',
        '.fob',
        '.foo'
      ].join('\n'))
    })
  })
})
