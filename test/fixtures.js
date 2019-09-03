'use strict'

const object = {
  com: {
    subdomains: {
      foo: {
        subdomains: {
          bag: {
            path: {
              hashes: ['bloop', 'boop', 'bop']
            },
            subdomains: {
              bah: {}
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
  '      #bloop',
  '      #boop',
  '      #bop',
  '      .bah',
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
  'https://bag.foo.com#bop',
  'https://bag.foo.com#boop',
  'https://bag.foo.com#bloop'
]

module.exports = {
  object,
  string,
  urls
}
