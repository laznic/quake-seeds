function onKeyUp(e) {
  if (e.keyCode === 13 && e.target.value.length) {
    goToSeeds()
  }
}

function onKeyUpName(e) {
  if (e.target.value.length) {
    const allNameInputs = getAllNameInputs()
    const currentNameIndex = allNameInputs.findIndex(element => element === e.target)

    if (currentNameIndex + 2 > allNameInputs.length) {
      const playerContainer = document.querySelector('.players')
      playerContainer.insertAdjacentHTML('beforeend', e.target.outerHTML)
    }
  }

  if (e.keyCode === 13 && e.target.value.length) {
    goToSeeds()
  }
}

function goToSeeds() {
  const inputElement = document.querySelector('.id')
  const id = inputElement.value

  const allNameInputs = getAllNameInputs()
  const hasNameValues = allNameInputs.some(input => input.value.length)

  removeWarning()

  if (id.length && !hasNameValues) {
    window.location.href = window.location.href + 'api/battlefy/' + id

  } else if (!id.length && hasNameValues) {
    const names = allNameInputs.map(input => input.value).filter(Boolean)
                               .map((value, i) => i === 0 ? '?name=' + value : 'name=' + value)
                               .join('&')
    names[0] = '?' + names[0]

    window.location.href = window.location.href + 'api/players' + names

  } else {
    document.querySelector('section').insertAdjacentHTML('afterbegin',
      '<span class="warning">You can choose either Battlefy or manual input, not both!</span>'
    )
  }
}

function removeWarning() {
  if (document.querySelector('.warning')) {
    document.querySelector('.warning').remove()
  }
}

function getAllNameInputs() {
  return Array.from(document.querySelectorAll('.name'))
}
