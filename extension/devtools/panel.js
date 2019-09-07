'use strict'

/* global browser */

const clearBtn = document.getElementById('clear-btn')
const filterInput = document.getElementById('filter-input')
const showBtn = document.getElementById('show-btn')
const treeDisplay = document.getElementById('tree-display')

clearBtn.onclick = async () => {
  await browser.runtime.sendMessage({ type: 'clear' })

  treeDisplay.innerText = ''
}

showBtn.onclick = async () => {
  const filter = filterInput.value.trim()

  let url

  if (filter) {
    url = 'https://' + filter

    try {
      /* eslint-disable-next-line no-new */
      new URL(url)
    } catch (_) {
      /* eslint-disable-next-line no-undef */
      alert('Please enter a valid URL')
      return
    }
  }

  const tree = await browser.runtime.sendMessage({ type: 'show', url })

  treeDisplay.innerText = tree || 'Couldn\'t find anything :('
}
