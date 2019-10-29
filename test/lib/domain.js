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

  describe('#toHTML()', () => {
    it('alphabetizes subdomains when converting to HTML', () => {
      this.domain.setSubdomain('foo')
      this.domain.setSubdomain('baz')
      this.domain.setSubdomain('fob')
      this.domain.setSubdomain('bar')

      const result = this.domain.toHTML()

      assert.strictEqual(result, [
        '<button class="web-tree-btn">.bar</button>',
        '<div class="web-tree-div">',
        '</div>',
        '<button class="web-tree-btn">.baz</button>',
        '<div class="web-tree-div">',
        '</div>',
        '<button class="web-tree-btn">.fob</button>',
        '<div class="web-tree-div">',
        '</div>',
        '<button class="web-tree-btn">.foo</button>',
        '<div class="web-tree-div">',
        '</div>'
      ].join('\n'))
    })
  })

  describe('#toString()', () => {
    it('alphabetizes subdomains when stringifying', () => {
      this.domain.setSubdomain('foo')
      this.domain.setSubdomain('baz')
      this.domain.setSubdomain('fob')
      this.domain.setSubdomain('bar')

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
