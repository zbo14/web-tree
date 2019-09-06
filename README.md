# url-tree

## Install

`npm i --save url-tree`

## Usage

### Create a tree

```js
'use strict'

const Tree = require('url-tree')

const tree = new Tree()
```

### Add URLs to tree

```js
// Set domains
tree.set('https://foo.com')
tree.set('https://bar.foo.com')

// Set paths
tree.set('https://baz.bar.foo.com?testing=123')
tree.set('https://bar.foo.com/bam/fob')
tree.set('https://bar.foo.com/bam/boo')
```

### Get URL domain/path in tree

```js
tree.get('https://foo.com')             // returns domain
tree.get('https://bar.foo.com/bam/fob') // returns path
tree.get('https://foo.com/')            // returns undefined
```

### Generate an object representation of tree

```js
tree.toObject()

// {
//   com: {
//     subdomains: {
//       foo: {
//         subdomains: {
//           bar: {
//             path: {
//               subpaths: {
//                 bam: {
//                   subpaths: {
//                     fob: {},
//                     boo: {}
//                   }
//                 }
//               }
//             },
//             subdomains: {
//               baz: {
//                 path: {
//                   searchParams: {
//                     testing: ['123']
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }
```

### Generate a string representation of tree

```js
tree.toString()

// .com
//   .foo
//     .bar
//       /bam
//         /boo
//         /fob
//       .baz
//         ?testing=123
```

### Delete URLs from tree

```js
// Delete domains
tree.delete('https://baz.bar.foo.com')     // returns true
tree.delete('https://bam.bar.foo.com')     // returns false

// Delete paths
tree.delete('https://bar.foo.com/bam/fob') // returns true
tree.delete('https://foo.com/')            // returns false

// Check string representation
tree.toString()

// .com
//   .foo
//     .bar
//       /bam
//         /boo
```

## Test

`npm test`

## Lint

`npm run lint`

## Documentation

`npm run doc`

## Contributing

Please do!

If you find a bug, want a feature added, or just have a question, feel free to [open an issue](https://github.com/zbo14/url-tree/issues/new). In addition, you're welcome to [create a pull request](https://github.com/zbo14/url-tree/compare/develop...) addressing an issue. You should push your changes to a feature branch and request merge to `develop`.

Make sure linting and tests pass and coverage is 💯 before creating a pull request!
