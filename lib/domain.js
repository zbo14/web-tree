'use strict'

const Path = require('./path')

/**
 * Class that represents a domain in the URL tree.
 */
class Domain {
  constructor () {
    this.path = new Path()
    this.subdomains = new Map()
  }

  getPath (path) {
    const keys = path.split('/').filter(Boolean)
    path = this.path

    if (keys.length) {
      path = path.getSubpath(keys)
    }

    if (!path) return

    return path
  }

  getSubdomain ([key, ...keys]) {
    const subdomain = this.subdomains.get(key)

    if (!subdomain) return

    return keys.length ? subdomain.getSubdomain(keys) : subdomain
  }

  setPath (path) {
    const keys = path.split('/').filter(Boolean)
    path = this.path

    if (keys.length) {
      path = path.getSubpath(keys) || path.setSubpath(keys)
    }

    return path
  }

  setSubdomain ([key, ...keys]) {
    let subdomain

    if (!keys.length) {
      this.subdomains.set(key, subdomain = new Domain())
      return subdomain
    }

    subdomain = this.subdomains.get(key)

    if (!subdomain) {
      this.subdomains.set(key, subdomain = new Domain())
    }

    return subdomain.setSubdomain(keys)
  }

  toObject () {
    const obj = {}
    const path = this.path.toObject()

    if (Object.keys(path).length) {
      obj.path = path
    }

    if (this.subdomains.size) {
      obj.subdomains = {}

      this.subdomains.forEach((subdomain, key) => {
        obj.subdomains[key] = subdomain.toObject()
      })
    }

    return obj
  }

  toString (level) {
    const arr = []
    const path = this.path.toString(level)

    path && arr.push(path)

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
