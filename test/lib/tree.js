'use strict'

const assert = require('assert')
const Domain = require('../../lib/domain')
const fixtures = require('../fixtures')
const Path = require('../../lib/path')
const Tree = require('../../lib/tree')

describe('lib/tree', () => {
  beforeEach(() => {
    this.tree = new Tree()
    fixtures.urls.forEach(url => this.tree.set(url))
  })

  describe('#toHTML()', () => {
    it('converts tree to HTML', () => {
      const result = this.tree.toHTML()
      assert.strictEqual(result, fixtures.html)
    })
  })

  describe('#toObject()', () => {
    it('converts tree to an object', () => {
      const result = this.tree.toObject()
      assert.deepStrictEqual(result, fixtures.object)
    })
  })

  describe('#toString()', () => {
    it('converts tree to a string', () => {
      const result = this.tree.toString()
      assert.strictEqual(result, fixtures.string)
    })
  })

  describe('#get()', () => {
    it('gets domain', () => {
      const result = this.tree.get('https://bah.bag.foo.com')
      assert(result instanceof Domain)
    })

    it('gets path', () => {
      const result = this.tree.get('https://bar.foo.com/bam')
      assert(result instanceof Path)
    })

    it('gets path when there\'s trailing slash', () => {
      const result = this.tree.get('https://bah.bag.foo.com/')
      assert(result instanceof Path)
    })

    it('returns undefined when it can\'t find top-level domain', () => {
      const result = this.tree.get('https://net')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined when it can\'t find subdomain', () => {
      const result = this.tree.get('https://fob.foo.com')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined when it can\'t find subdomain (path specified)', () => {
      const result = this.tree.get('https://fob.foo.com/fomo')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined when it can\'t find path', () => {
      const result = this.tree.get('https://foo.com/bar')
      assert.strictEqual(result, undefined)
    })
  })

  describe('#set()', () => {
    it('sets path for top-level domain', () => {
      const result = this.tree.set('https://org/grog')

      assert(result instanceof Path)
      assert.deepStrictEqual(this.tree.get('https://org/grog'), result)
    })
  })

  describe('#delete()', () => {
    it('deletes subpath', () => {
      const url = 'https://bar.foo.com/bam/boo'
      assert.strictEqual(this.tree.delete(url), true)
      assert.strictEqual(this.tree.get(url), undefined)
    })

    it('deletes whole path', () => {
      const url = 'https://bar.foo.com/'
      assert.strictEqual(this.tree.delete(url), true)
      assert.strictEqual(this.tree.get(url), undefined)
    })

    it('deletes a subdomain', () => {
      const url = 'https://bah.bag.foo.com'
      assert.strictEqual(this.tree.delete(url), true)
      assert.strictEqual(this.tree.get(url), undefined)
    })

    it('fails to delete path', () => {
      const result = this.tree.delete('https://bar.foo.com/bam/foo')
      assert.strictEqual(result, false)
    })

    it('fails to delete path on top-level domain', () => {
      const result = this.tree.delete('https://com/foo')
      assert.strictEqual(result, false)
    })

    it('fails to delete path when it can\'t find subdomain', () => {
      const result = this.tree.delete('https://baz.bag.foo.com/wuz/up')
      assert.strictEqual(result, false)
    })

    it('fails to delete subpath of subpath that doesn\'t exist', () => {
      const result = this.tree.delete('https://bar.foo.com/foo/bam/biz')
      assert.strictEqual(result, false)
    })

    it('fails to delete subdomain', () => {
      const result = this.tree.delete('https://baz.bag.foo.com')
      assert.strictEqual(result, false)
    })

    it('fails to delete subdomain of subdomain that doesn\'t exist', () => {
      const result = this.tree.delete('https://baz.bar.bag.foo.com')
      assert.strictEqual(result, false)
    })

    it('fails to delete top-level domain', () => {
      const result = this.tree.delete('https://org')
      assert.strictEqual(result, false)
    })
  })
})
