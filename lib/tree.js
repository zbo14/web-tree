'use strict'

const Domain = require('./domain')

/**
 * The URL tree class.
 *
 * @extends Map
 */
class Tree extends Map {
  /**
   * Remove a URL domain or path from the tree.
   *
   * @param  {(String|URL)} url
   *
   * @return {Boolean}
   */
  delete (url) {
    const { hostname, pathname } = new URL(url)

    const [key, ...keys] = hostname
      .split('.')
      .reverse()

    let domain = super.get(key)

    if (!domain) return false

    if (pathname === '/' && !url.endsWith('/')) {
      return domain.deleteSubdomain(...keys)
    }

    if (keys.length) {
      domain = domain.getSubdomain(...keys)
    }

    if (!domain) return false

    return domain.deletePath(pathname)
  }

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
   * @return {(Domain|Path)}
   */
  set (url) {
    const { hash, hostname, pathname, searchParams } = new URL(url)

    const [key, ...keys] = hostname
      .split('.')
      .reverse()

    let domain = super.get(key)

    if (!domain) {
      super.set(key, domain = new Domain())
    }

    if (keys.length) {
      domain = domain.getSubdomain(...keys) || domain.setSubdomain(...keys)
    }

    const setDomain = pathname === '/' &&
      !url.endsWith('/') &&
      !hash &&
      ![...searchParams.keys()].length

    if (setDomain) return domain

    const path = domain.setPath(pathname)

    path.setHash(hash)
    path.setSearchParams(searchParams)

    return path
  }

  /**
   * Generate an HTML representation of the tree.
   *
   * @return {String}
   */
  toHTML () {
    const arr = []

    this.forEach((domain, key) => {
      arr.push('<button class="web-tree-btn">.' + key + '</button>')
      arr.push('<div class="web-tree-div">')
      domain = domain.toHTML(1)
      domain && arr.push(domain)
      arr.push('</div>')
    })

    return arr.join('\n')
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
