'use strict'

const Path = require('./path')

/**
 * Class that represents a URL domain.
 */
class Domain {
  constructor () {
    this.subdomains = new Map()
  }

  deletePath (pathname) {
    const path = this.path

    if (!path) return false

    const keys = pathname.split('/').filter(Boolean)

    return keys.length
      ? path.deleteSubpath(...keys)
      : delete this.path
  }

  deleteSubdomain (key, ...keys) {
    if (!keys.length) return this.subdomains.delete(key)

    const subdomain = this.getSubdomain(key, ...keys.slice(0, -1))

    if (!subdomain) return false

    return subdomain.deleteSubdomain(...keys.slice(-1))
  }

  getPath (pathname) {
    let path = this.path

    if (!path) return

    const keys = pathname.split('/').filter(Boolean)

    if (keys.length) {
      path = path.getSubpath(...keys)
    }

    return path
  }

  getSubdomain (key, ...keys) {
    const subdomain = this.subdomains.get(key)

    if (!subdomain) return

    return keys.length ? subdomain.getSubdomain(...keys) : subdomain
  }

  setPath (pathname) {
    const keys = pathname.split('/').filter(Boolean)
    let path = this.path = this.path || new Path()

    if (keys.length) {
      path = path.getSubpath(...keys) || path.setSubpath(...keys)
    }

    return path
  }

  setSubdomain (key, ...keys) {
    let subdomain

    if (!keys.length) {
      this.subdomains.set(key, subdomain = new Domain())
      return subdomain
    }

    subdomain = this.subdomains.get(key)

    if (!subdomain) {
      this.subdomains.set(key, subdomain = new Domain())
    }

    return subdomain.setSubdomain(...keys)
  }

  toObject () {
    const obj = {}

    if (this.path) {
      obj.path = this.path.toObject()
    }

    if (this.subdomains.size) {
      obj.subdomains = {}

      this.subdomains.forEach((subdomain, key) => {
        obj.subdomains[key] = subdomain.toObject()
      })
    }

    return obj
  }

  toString (level = 0) {
    const arr = []

    if (this.path) {
      const path = this.path.toString(level)
      path && arr.push(path)
    }

    const subdomains = []

    this.subdomains.forEach((domain, key) => subdomains.push({ domain, key }))

    subdomains
      .sort((a, b) => a.key > b.key ? 1 : -1)
      .forEach(({ domain, key }) => {
        arr.push('  '.repeat(level) + '.' + key)
        domain = domain.toString(level + 1)
        domain && arr.push(domain)
      })

    return arr.join('\n')
  }
}

module.exports = Domain
