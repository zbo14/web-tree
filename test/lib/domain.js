'use strict'

const assert = require('assert')
const Domain = require('../../lib/domain')

describe('lib/domain', () => {
  beforeEach(() => {
    this.domain = new Domain()
  })

  describe('#get()', () => {
    it('returns undefined when no paths are set', () => {
      const result = this.domain.getPath('/foo/bar')
      assert.strictEqual(result, undefined)
    })
  })

  describe('#toString()', () => {
    it('alphabetizes subdomains when stringifying', () => {
      this.domain.setSubdomain(['foo'])
      this.domain.setSubdomain(['baz'])
      this.domain.setSubdomain(['fob'])
      this.domain.setSubdomain(['bar'])

      const result = this.domain.toString()

      assert.strictEqual(result, [
        '.bar',
        '.baz',
        '.fob',
        '.foo'
      ].join('\n'))
    })
  })
})
