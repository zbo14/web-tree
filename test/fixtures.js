'use strict'

const object = {
  com: {
    subdomains: {
      foo: {
        subdomains: {
          bag: {
            subdomains: {
              bah: {
                path: {
                  hashes: ['bloop', 'boop', 'bop']
                }
              }
            }
          },

          bar: {
            path: {
              subpaths: {
                bam: {
                  subpaths: {
                    boo: {},
                    fob: {}
                  }
                }
              }
            },

            subdomains: {
              baz: {
                path: {
                  searchParams: {
                    searching4: ['something'],
                    testing: ['123', '456']
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

const string = [
  '.com',
  '  .foo',
  '    .bag',
  '      .bah',
  '        #bloop',
  '        #boop',
  '        #bop',
  '    .bar',
  '      /bam',
  '        /boo',
  '        /fob',
  '      .baz',
  '        ?searching4=something',
  '        ?testing=123',
  '        ?testing=456'
].join('\n')

const urls = [
  'https://foo.com',
  'https://bar.foo.com',
  'https://baz.bar.foo.com',
  'https://bar.foo.com/bam/fob',
  'https://bar.foo.com/bam/boo',
  'https://baz.bar.foo.com?testing=456',
  'https://baz.bar.foo.com?testing=123',
  'https://baz.bar.foo.com?testing=123',
  'https://baz.bar.foo.com?searching4=something',
  'https://bah.bag.foo.com',
  'https://bah.bag.foo.com#bop',
  'https://bah.bag.foo.com#boop',
  'https://bah.bag.foo.com#bloop'
]

module.exports = {
  object,
  string,
  urls
}
