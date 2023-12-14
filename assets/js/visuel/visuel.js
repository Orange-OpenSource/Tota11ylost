const buttons = document.querySelectorAll('button');
const correctSequence = ["green-button", "blue-button", "red-button", "purple-button"];
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
            window.location.href = '2-1-simulation-visuel.html';
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

// Ajouter un gestionnaire d'événement à chaque bouton
buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (sequenceIndex < correctSequence.length) {
            handleButtonClick(button.id);
        }
    });
});

// Initialiser l'état initial (masquer l'image)
resetSequence();