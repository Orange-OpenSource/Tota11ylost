// Fonction pour refresh si on veut avancer la barre de progression
function disableSeeking(audioId) {
    var audioElement = document.getElementById(audioId);
    audioElement.addEventListener('seeking', function (event) {
        if(event.target.currentTime > 0){
           window.location.reload();
        }
    });
}

// Appliquer la fonction à chaque audio sauf le dernier
disableSeeking('audio1');
disableSeeking('audio2');
disableSeeking('audio3');
disableSeeking('audio4');
//disableSeeking('audio5');

audio1.addEventListener('ended', function () {
    audio2.style.display = 'block'; // Affiche le fichier audio 2
});

// Écouteur d'événement pour la fin de la lecture du fichier audio 2
audio2.addEventListener('ended', function () {
    audio3.style.display = 'block'; // Affiche le fichier audio 3
});

// Écouteur d'événement pour la fin de la lecture du fichier audio 3
audio3.addEventListener('ended', function () {
    audio4.style.display = 'block'; // Affiche le fichier audio 4
});

// Écouteur d'événement pour la fin de la lecture du fichier audio 3
audio4.addEventListener('ended', function () {
    audio5.style.display = 'block'; // Affiche le fichier audio 5
});

var validButton = document.getElementById('valider');
var alertDiv = document.getElementById('errorDiv');
var href='./5-1-simulation-auditive.html';

validButton.addEventListener("click", (e) => {
    const reponse = document.getElementById('reponse').value.toLowerCase();

    if (reponse === 'helen keller' || reponse === 'keller') {
        document.location.assign(href);
    } else {
        alertDiv.classList.remove("d-none");
        window.location.hash = '#errorDiv';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const audio2 = document.getElementById('audio2');
    const audio3 = document.getElementById('audio3');
    const audio4 = document.getElementById('audio4');
    const audio5 = document.getElementById('audio5');

    // Désactive les fichiers audio 2, 3 et 4 au chargement de la page
    audio2.style.display = 'none';
    audio3.style.display = 'none';
    audio4.style.display = 'none';
    audio5.style.display = 'none';

});