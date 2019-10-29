'use strict'

/* global browser, Tree */

let tree = new Tree()

const listener = details => {
  if (details.statusCode !== 404) {
    tree.set(details.url)
  }
}

const filter = { urls: ['<all_urls>'] }

browser.webRequest.onResponseStarted.addListener(listener, filter)

// explicitly construct promise so devtools script can `await` sendMessage
browser.runtime.onMessage.addListener(async msg => {
  let result

  switch (msg.type) {
    case 'clear':
      tree = new Tree()
      break

    case 'show':
      result = msg.url ? tree.get(msg.url) : tree
      result = result && result.toHTML()
      break
  }

  return result
})
