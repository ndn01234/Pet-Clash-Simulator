function toggleMode() {
  document.body.classList.toggle("dark")
}

async function startBattle(petId) {
  const res = await fetch(`/battle/${petId}`)
  const data = await res.json()
  alert(data.result)
}
function actionAlert(action) {
  alert(action + " feature coming soon!")
}
