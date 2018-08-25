function goToSeeds() {
  const inputElement = document.querySelector('.id')
  const id = inputElement.value

  window.location.href = window.location.href + 'api/battlefy/' + id
}
