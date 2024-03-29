const correctSequence = ["green-button", "blue-button", "red-button", "purple-button"];

const buttonDiv = [
  {
    label: "Bouton bleu",
    id: "blue-button"
  },
  {
    label: "Bouton violet",
    id: "purple-button"
  },
  {
    label: "Bouton vert",
    id: "green-button"
  },
  {
    label: "Bouton rouge",
    id: "red-button"
  }
];

let sequenceIndex = 0;
let messageInvalidDiv = document.getElementById('error-message');

// Fonction pour réinitialiser la séquence sans afficher de message d'erreur
function resetSequence() {
  sequenceIndex = 0;
  messageInvalidDiv.classList.add('d-none');
}

// Fonction pour gérer les clics sur les boutons
function handleButtonClick(buttonId) {
  if (buttonId === correctSequence[sequenceIndex]) {
    sequenceIndex++;
    if (sequenceIndex === correctSequence.length) {
      // Rediriger l'utilisateur vers la nouvelle URL
      window.location.href = './visual-simulation.html';
    }
  } else {
    invalidSequence();
  }
}

// Fonction pour gérer une séquence incorrecte
function invalidSequence() {
  resetSequence();
  messageInvalidDiv.classList.remove('d-none');
  // Supprimer le message d'erreur après 5 secondes
  setTimeout(() => {
    messageInvalidDiv.classList.add('d-none');
  }, 2000); // Le message d'erreur sera supprimé après 5 secondes
}

// Initialiser l'état initial (masquer l'image)
resetSequence();

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", (event) => {
  let divbutton = document.getElementById('buttonDiv');
  shuffle(buttonDiv)
  buttonDiv.forEach(buttonD => {
    let button = document.createElement('button');
    langManager.subscribe(
      () => button.textContent = i18next.t('visual.buttonsLabel')
    );
    button.id = buttonD.id;
    button.setAttribute("aria-label", buttonD.label);
    button.classList.add("btn", "btn-dark", "m-2");
    button.addEventListener('click', () => {
      if (sequenceIndex < correctSequence.length) {
        handleButtonClick(button.id);
      }
    });
    divbutton.append(button)
  });

});
