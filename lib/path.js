'use strict'

/**
 * Class that represents a URL path.
 */
class Path {
  constructor () {
    this.hashes = new Set()
    this.searchParams = new Map()
    this.subpaths = new Map()
  }

  getSubpath ([key, ...keys]) {
    const subpath = this.subpaths.get(key)

    if (!subpath) return

    return keys.length ? subpath.getSubpath(keys) : subpath
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

  setSubpath ([key, ...keys]) {
    let subpath

    if (!keys.length) {
      this.subpaths.set(key, subpath = new Path())
      return subpath
    }

    subpath = this.subpaths.get(key)

    if (!subpath) {
      this.subpaths.set(key, subpath = new Path())
    }

    return subpath.setSubpath(keys)
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
      .sort((a, b) => a.key > b.key ? 1 : -1)
      .forEach(({ key, values }) => {
        [...values].sort()
          .forEach(value => {
            arr.push('  '.repeat(level) + '?' + key + '=' + value)
          })
      })

    subpaths
      .sort((a, b) => a.key > b.key ? 1 : -1)
      .forEach(({ key, path }) => {
        arr.push('  '.repeat(level) + '/' + key)
        path = path.toString(level + 1)
        path && arr.push(path)
      })

    return arr.join('\n')
  }
}

module.exports = Path
