btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      disableCognitiveSimulation();
      break;
    default:
  }
});

function disableCognitiveSimulation() {
  clearInterval(intervalCognitiveSimulation);

  let riddles = document.querySelectorAll(".riddles li");

  const riddle1 = i18next.t("cognitiveSimu.riddle1", { returnObjects: true });
  const riddle2 = i18next.t("cognitiveSimu.riddle2", { returnObjects: true });
  const riddle3 = i18next.t("cognitiveSimu.riddle3", { returnObjects: true });

  const listOfRiddles = new Array(riddle1, riddle2, riddle3);

  for (let i = 0; i < listOfRiddles.length; i++) {
    riddles[i].innerHTML = listOfRiddles[i];
  }

  let imagesOverlay = document.getElementById('overlay');
  imagesOverlay.classList.add('d-none');
}
