'use strict'

const { URL } = require('url')
const Domain = require('./domain')

/**
 * The URL tree class.
 *
 * @extends Map
 */
class Tree extends Map {
  /**
   * Get a URL path in the tree.
   *
   * @param  {(String|URL)} url
   *
   * @return {(Path|undefined)}
   */
  get (url) {
    url = new URL(url)

    const [key, ...keys] = url.hostname
      .split('.')
      .reverse()

    let domain = super.get(key)

    if (!domain) return

    if (keys.length) {
      domain = domain.getSubdomain(keys)
    }

    if (!domain) return

    return domain.getPath(url.pathname)
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
      domain = domain.getSubdomain(keys) || domain.setSubdomain(keys)
    }

    const path = domain.setPath(url.pathname)

    path.setHash(url.hash)
    path.setSearchParams(url.searchParams)

    return path
  }

  /**
   * Returns an object representation of the tree.
   *
   * @return {Object}
   */
  toObject () {
    const tree = {}

    this.forEach((domain, key) => {
      tree[key] = domain.toObject()
    })

    return tree
  }

  /**
   * Returns a string representation of the tree.
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
