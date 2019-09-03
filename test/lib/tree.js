'use strict'

const assert = require('assert')
const fixtures = require('../fixtures')
const Path = require('../../lib/path')
const Tree = require('../../lib/tree')

describe('lib/tree', () => {
  beforeEach(() => {
    this.tree = new Tree()
    fixtures.urls.forEach(url => this.tree.set(url))
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
    it('gets a path', () => {
      const result = this.tree.get('https://foo.com')
      assert(result instanceof Path)
    })

    it('gets the same path', () => {
      const result = this.tree.get('https://foo.com/')
      assert.deepStrictEqual(result, this.tree.get('https://foo.com'))
    })

    it('gets path from top-level domain', () => {
      const result = this.tree.get('https://com')
      assert(result instanceof Path)
    })

    it('returns undefined when it can\'t find top-level domain', () => {
      const result = this.tree.get('https://net')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined when it can\'t find subdomain', () => {
      const result = this.tree.get('https://fob.com')
      assert.strictEqual(result, undefined)
    })

    it('returns undefined when it can\'t find path', () => {
      const result = this.tree.get('https://foo.com/bar')
      assert.strictEqual(result, undefined)
    })
  })

  describe('#set()', () => {
    it('sets top-level domain', () => {
      const result = this.tree.set('https://org')

      assert(result instanceof Path)
      assert.deepStrictEqual(this.tree.get('https://org'), result)
    })
  })
})
