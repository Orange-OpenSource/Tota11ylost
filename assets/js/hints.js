const btnIndice = document.getElementById('indice');
const displayTimer = document.getElementById("displayTimer");

// Display timer before hint button activation
function startTimer(duration, display) {
  var start = Date.now(),
    diff,
    minutes,
    seconds;

  function timer() {
    diff = duration - (((Date.now() - start) / 1000) | 0);

    minutes = (diff / 60) % 60 | 0;
    seconds = (diff % 60) | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (diff <= 0) {
      start = Date.now() + 1000;
    }
  };
  timer();
  setInterval(timer, 1000);
}

let display = document.querySelector('#time');
startTimer(5 * 60, display);

// Activate hint buttton and remove time after 5min
setTimeout(() => {
  btnIndice.removeAttribute("disabled");
  displayTimer.classList.add("d-none");
}, 300000);


// Hint system
let indice = 0;
const indiceText = [
  '',
  'Eh oui, pas facile de remplir un formulaire quand on a pas de label... Les labels ont maintenant été rajoutés.',
  'Ça peut être frustrant de ne pas savoir pourquoi on ne peut pas valider un formulaire. Laissez toujours la possibilité de valider le formulaire et ajoutez y des messages d\'erreurs !!!',
  'C\'est bien beau d\'avoir mis un message d\'erreur, mais s\'il n\'est pas précis il ne servira à rien. Les messages d\'erreurs doivent être précis et lié aux champs de formulaire afin de déterminer rapidement l\'erreur. Et voila des messages d\'erreurs ont été rajoutés.'
]

const indiceTime = [30, 120, 300, 0];

btnIndice.addEventListener('click', (e) => {
  addTime(indiceTime[indice]);
  indice++;
  updateIndiceButton();

  switch (indice) {
    case 1:
      addIndice();
      break;
    case 2:
      addIndice();
      break;
    case 3:
      addIndice();
      e.target.disabled = true;
      e.target.innerHTML = "Plus d'indices disponibles";

      break;
    default:
  }

});

function addIndice() {
  const indiceDiv = document.getElementById("indice" + indice);

  let para = document.createElement("p");
  let node = document.createTextNode(indiceText[indice]);
  para.appendChild(node);
  indiceDiv.appendChild(para);
  indiceDiv.classList.remove('d-none')
}

function updateIndiceButton() {
  let getIndiceTime = indiceTime[indice];
  let textTime = "";
  let durationTime = "";

  if (getIndiceTime < 60 && indiceTime !== 0) {
    textTime = "sec"
    durationTime = getIndiceTime;
  } else {
    textTime = "min";
    durationTime = getIndiceTime / 60;
  }
  btnIndice.textContent = "Prendre un indice (+" + durationTime + " " + textTime + ")";
}
