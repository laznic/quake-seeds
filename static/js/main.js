function onKeyUp(e) {
  if (e.keyCode === 13 && e.target.value.length) {
    goToSeeds()
  }
}

function goToSeeds() {
  const inputElement = document.querySelector('.id')
  const id = inputElement.value

  window.location.href = window.location.href + 'api/battlefy/' + id
}
