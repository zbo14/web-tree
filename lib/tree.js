'use strict'

const Domain = require('./domain')

/**
 * The URL tree class.
 *
 * @extends Map
 */
class Tree extends Map {
  /**
   * Get a URL domain or path in the tree.
   *
   * @param  {(String|URL)} url
   *
   * @return {(Domain|Path|undefined)}
   */
  get (url) {
    const { hostname, pathname } = new URL(url)

    const [key, ...keys] = hostname
      .split('.')
      .reverse()

    let domain = super.get(key)

    if (!domain) return

    if (keys.length) {
      domain = domain.getSubdomain(...keys)
    }

    if (pathname === '/' && !url.endsWith('/')) return domain

    if (!domain) return

    return domain.getPath(pathname)
  }

  /**
   * Add a URL to the tree.
   *
   * @param  {(String|URL)} url
   *
   * @return {Path}
   */
  set (url) {
    url = new URL(url)

    const [key, ...keys] = url.hostname
      .split('.')
      .reverse()

    let domain = super.get(key)

    if (!domain) {
      super.set(key, domain = new Domain())
    }

    if (keys.length) {
      domain = domain.getSubdomain(...keys) || domain.setSubdomain(...keys)
    }

    const path = domain.setPath(url.pathname)

    path.setHash(url.hash)
    path.setSearchParams(url.searchParams)

    return path
  }

  /**
   * Generate an object representation of the tree.
   *
   * @return {Object}
   */
  toObject () {
    const obj = {}

    this.forEach((domain, key) => {
      obj[key] = domain.toObject()
    })

    return obj
  }

  /**
   * Generate a string representation of the tree.
   *
   * @return {String}
   */
  toString () {
    const arr = []

    this.forEach((domain, key) => arr.push('.' + key, domain.toString(1)))

    return arr.join('\n')
  }
}

module.exports = Tree
