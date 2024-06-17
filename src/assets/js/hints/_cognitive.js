btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      disableDyslexiaSimulation();
      break;
    default:
  }
});

function disableDyslexiaSimulation() {
  clearInterval(intervalSimulation);

  while (divLink.firstChild) {
    divLink.removeChild(divLink.firstChild);
  }

  createButtons(globalLinkDyslexie);
}
