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

  treeDisplay.innerHTML = tree || '<p>Couldn\'t find anything :(</p>'

  const btns = document.getElementsByClassName('web-tree-btn')

  for (const btn of btns) {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active')

      const div = btn.nextElementSibling

      if (!div.style.display || div.style.display === 'none') {
        div.style.display = 'block'
        return
      }

      div.style.display = 'none'

      const btns = div.querySelectorAll('.web-tree-btn')
      const divs = div.querySelectorAll('.web-tree-div')

      for (const btn of btns) {
        btn.classList.remove('active')
      }

      for (const div of divs) {
        div.style.display = 'none'
      }
    })
  }
}
