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

function onKeyUpTeam(e) {
  if (e.target.value.length) {
    const allTeams = getAllTeams()
    const currentTeamIndex = allTeams.findIndex(element => element.contains(e.target))
    const currentTeam = allTeams[currentTeamIndex]
    const teamMembers = Array.from(currentTeam.children).find(child => child.className === 'team-members')
    const hasBothPlayers = Array.from(teamMembers.children).every(member => member.value.length)

    if (currentTeamIndex + 2 > allTeams.length && hasBothPlayers) {
      const playerContainer = document.querySelector('.players')

      playerContainer.insertAdjacentHTML('beforeend', allTeams[currentTeamIndex].outerHTML)

      if (e.keyCode === 13) {
        goToSeeds()
      }
    }
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

    window.location.href = window.location.href + 'api/players' + names

  } else {
    document.querySelector('section').insertAdjacentHTML('afterbegin',
      '<span class="warning">You can choose either Battlefy or manual input, not both!</span>'
    )
  }
}

function goToTeamSeeds() {
  const inputElement = document.querySelector('.id')
  const id = inputElement.value

  const allTeams = getAllTeams()
  const hasTeamValues = allTeams.some(team => team.firstElementChild.value.length)

  removeWarning()

  if (id.length && !hasTeamValues) {
    window.location.href = window.location.origin + '/api/battlefy/2v2/' + id

  } else if (!id.length && hasTeamValues) {
    const teams = allTeams.map(team => {
      const teamMembers = Array.from(team.children).find(child => child.className === 'team-members')
      const members = Array.from(teamMembers.children).map(member => member.value)

      if (team.firstElementChild.value && members.every(member => member.length)) {
        return {
          teamName: team.firstElementChild.value,
          members
        }
      }

    }).filter(Boolean)
      .map((team, i) => i === 0 ? '?' + team.teamName + '=' + team.members.join(',') : team.teamName + '=' + team.members.join(','))
      .join('&')

    window.location.href = window.location.origin + '/api/teams' + teams

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

function getAllTeams() {
  return Array.from(document.querySelectorAll('.team'))
}
