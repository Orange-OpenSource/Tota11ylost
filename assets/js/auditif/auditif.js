/*
Software Name: Tota11ylost
SPDX-FileCopyrightText: Copyright (c) Orange SA
SPDX-License-Identifier: AGPL-3.0-or-later

This software is distributed under the GNU Affero General Public License v3.0 or later,
the text of which is available at https://opensource.org/license/agpl-v3
or see the "LICENSE" file for more details.

Authors: See CONTRIBUTORS.txt file
Software description: Experience in a playful way the challenges faced by people with digital disabilities
*/

// Fonction pour refresh si on veut avancer la barre de progression
function disableSeeking(audioId) {
  var audioElement = document.getElementById(audioId);
  audioElement.addEventListener('seeking', function (event) {
    if (event.target.currentTime > 0) {
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

let validButton = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
const href = is30Version() ? './form-registration.html' : './hearing-simulation.html';

validButton.addEventListener("click", (e) => {
  const writtenResponse = document.getElementById('reponse').value.toLowerCase();
  const possibleResponses = i18next.t('hearing.possibleResponses', {returnObjects: true});
  const isCorrectResponse = possibleResponses.find(response => response === writtenResponse);

  if (isCorrectResponse) {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});

document.addEventListener('DOMContentLoaded', function () {
  for (let i = 2; i <= 5; i++) {
    let element = document.getElementById('audio' + i);
    element.style.display = 'none';
  }

  const srcRoot = "../assets/mp3/deafness-";
  for (let i = 1; i <= 5; i++) {
    let element = document.getElementById('audio' + i);
    element.innerHTML = `<source id="audio-file${i}" src="../assets/mp3/deafness-${i}_${getLang()}.MP3" type="audio/mpeg">`
  }
});
