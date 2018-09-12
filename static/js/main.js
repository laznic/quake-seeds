function onKeyUp(e) {
  if (e.keyCode === 13 && e.target.value.length) {
    goToSeeds()
  }
}

function onKeyUpName(e) {
  if (e.target.value.length) {
    const allNameInputs = Array.from(document.querySelectorAll('.name'))
    const currentNameIndex = allNameInputs.findIndex(element => element === e.target)

    if (currentNameIndex + 2 > allNameInputs.length) {
      const playerContainer = document.querySelector('.players')
      playerContainer.insertAdjacentHTML('beforeend', e.target.outerHTML)
    }
  }
}

function goToSeeds() {
  const inputElement = document.querySelector('.id')
  const id = inputElement.value

  window.location.href = window.location.href + 'api/battlefy/' + id
}
