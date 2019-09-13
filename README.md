# web-tree

This repo has two components:
- An npm library for constructing URL trees
- A Firefox add-on that builds a URL tree as you browse and allows you to view the tree and filter by domain and/or path

## Install

### Add-on

You can install it [here](https://addons.mozilla.org/en-US/firefox/addon/web-tree)!

#### For development

1. Clone the repo and bundle the library for the browser with `npm run bundle`
1. Open Firefox and enter `about:debugging#/runtime/this-firefox` into the search bar
1. Click "Load Temporary Add-On"
1. Select `add-on/manifest.json` from the project directory

### Library

`npm i --save web-tree`

## Usage

### Add-on

Open devtools in Firefox and click on `web-tree`.

You should see `show` and `clear` buttons in the panel and a `filter` input.

The `show` button will display the *entire* tree or the subtree that falls under the `filter`ed domain/path (if any).

The `clear` button wipes the state of the tree clean.

### Library

#### Create a tree

```js
'use strict'

const Tree = require('web-tree')

const tree = new Tree()
```

#### Add URLs to tree

```js
// Set domains
tree.set('https://foo.com')
tree.set('https://bar.foo.com')

// Set paths
tree.set('https://baz.bar.foo.com?testing=123')
tree.set('https://bar.foo.com/bam/fob')
tree.set('https://bar.foo.com/bam/boo')
```

#### Get URL domain/path in tree

```js
tree.get('https://foo.com')             // returns domain
tree.get('https://bar.foo.com/bam/fob') // returns path
tree.get('https://foo.com/')            // returns undefined
```

#### Generate object representation of tree

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

#### Generate string representation of tree

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

#### Delete URLs from tree

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

If you find a bug, want a feature added, or just have a question, feel free to [open an issue](https://github.com/zbo14/web-tree/issues/new). In addition, you're welcome to [create a pull request](https://github.com/zbo14/web-tree/compare/develop...) addressing an issue. You should push your changes to a feature branch and request merge to `develop`.

Make sure linting and tests pass and coverage is 💯 before creating a pull request!
