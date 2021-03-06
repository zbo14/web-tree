'use strict'

const { sort } = require('./util')

/**
 * Class that represents a URL path.
 */
class Path {
  constructor () {
    this.hashes = new Set()
    this.searchParams = new Map()
    this.subpaths = new Map()
  }

  deleteSubpath (key, ...keys) {
    if (!keys.length) return this.subpaths.delete(key)

    const subpath = this.getSubpath(key, ...keys.slice(0, -1))

    if (!subpath) return false

    return subpath.deleteSubpath(...keys.slice(-1))
  }

  getSubpath (key, ...keys) {
    const subpath = this.subpaths.get(key)

    if (!subpath) return

    return keys.length ? subpath.getSubpath(...keys) : subpath
  }

  setHash (hash) {
    if (hash[0] === '#') {
      hash = hash.slice(1)
    }

    hash && this.hashes.add(hash)
  }

  setSearchParams (searchParams) {
    [...searchParams].forEach(([key, value]) => {
      let values = this.searchParams.get(key)

      if (!values) {
        this.searchParams.set(key, values = new Set())
      }

      values.add(value)
    })
  }

  setSubpath (key, ...keys) {
    let subpath

    if (!keys.length) {
      this.subpaths.set(key, subpath = new Path())
      return subpath
    }

    subpath = this.subpaths.get(key)

    if (!subpath) {
      this.subpaths.set(key, subpath = new Path())
    }

    return subpath.setSubpath(...keys)
  }

  toHTML (level = 0) {
    const arr = []
    const hashes = [...this.hashes].sort()
    const searchParams = []
    const subpaths = []

    this.searchParams.forEach((values, key) => searchParams.push({ key, values }))
    this.subpaths.forEach((path, key) => subpaths.push({ key, path }))

    hashes.forEach(hash => arr.push('  '.repeat(level) + '<p>#' + hash + '</p>'))

    searchParams
      .sort(sort)
      .forEach(({ key, values }) => {
        [...values].sort()
          .forEach(value => {
            arr.push('  '.repeat(level) + '<p>?' + key + '=' + value + '</p>')
          })
      })

    subpaths
      .sort(sort)
      .forEach(({ key, path }) => {
        arr.push('  '.repeat(level) + '<button class="web-tree-btn">' + '/' + key + '</button>')
        arr.push('  '.repeat(level) + '<div class="web-tree-div">')
        path = path.toHTML(level + 1)
        path && arr.push(path)
        arr.push('  '.repeat(level) + '</div>')
      })

    return arr.join('\n')
  }

  toObject () {
    const obj = {}

    if (this.hashes.size) {
      obj.hashes = [...this.hashes].sort()
    }

    if (this.searchParams.size) {
      obj.searchParams = {}

      this.searchParams.forEach((values, key) => {
        obj.searchParams[key] = [...values].sort()
      })
    }

    if (this.subpaths.size) {
      obj.subpaths = {}

      this.subpaths.forEach((path, key) => {
        obj.subpaths[key] = path.toObject()
      })
    }

    return obj
  }

  toString (level = 0) {
    const arr = []
    const hashes = [...this.hashes].sort()
    const searchParams = []
    const subpaths = []

    this.searchParams.forEach((values, key) => searchParams.push({ key, values }))
    this.subpaths.forEach((path, key) => subpaths.push({ key, path }))

    hashes.forEach(hash => arr.push('  '.repeat(level) + '#' + hash))

    searchParams
      .sort(sort)
      .forEach(({ key, values }) => {
        [...values].sort()
          .forEach(value => {
            arr.push('  '.repeat(level) + '?' + key + '=' + value)
          })
      })

    subpaths
      .sort(sort)
      .forEach(({ key, path }) => {
        arr.push('  '.repeat(level) + '/' + key)
        path = path.toString(level + 1)
        path && arr.push(path)
      })

    return arr.join('\n')
  }
}

module.exports = Path
