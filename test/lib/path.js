'use strict'

const assert = require('assert')
const Path = require('../../lib/path')

describe('lib/path', () => {
  beforeEach(() => {
    this.path = new Path()
    this.path.setSubpath('foo', 'bar', 'baz')
  })

  describe('#getSubpath()', () => {
    it('gets sub-path', () => {
      const result = this.path.getSubpath('foo', 'bar', 'baz')
      assert.deepStrictEqual(result, new Path())
    })
  })

  describe('#setSubpath()', () => {
    it('sets a path that also creates an intermediate path', () => {
      assert.strictEqual(this.path.getSubpath('foo', 'bam'), undefined)

      this.path.setSubpath('foo', 'bam', 'baz')
      const path = new Path()
      path.setSubpath('baz')

      assert.deepStrictEqual(this.path.getSubpath('foo', 'bam'), path)
    })
  })

  describe('#toString()', () => {
    it('alphabetizes search params when stringifying', () => {
      const searchParams = new Map([
        ['zeta', 'ziti'],
        ['alpha', 'beta'],
        ['zoom', 'boom']
      ])

      this.path.setSearchParams(searchParams)

      const result = this.path.toString()

      assert.strictEqual(result, [
        '?alpha=beta',
        '?zeta=ziti',
        '?zoom=boom',
        '/foo',
        '  /bar',
        '    /baz'
      ].join('\n'))
    })

    it('alphabetizes subpaths when stringifying', () => {
      this.path.setSubpath('zeta')
      this.path.setSubpath('alpha')

      const result = this.path.toString()

      assert.strictEqual(result, [
        '/alpha',
        '/foo',
        '  /bar',
        '    /baz',
        '/zeta'
      ].join('\n'))
    })
  })
})
