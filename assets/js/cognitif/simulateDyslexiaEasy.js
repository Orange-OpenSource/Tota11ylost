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

function simulateDyslexia(text) {
  const simulatedText = [];
  for (const char of text) {
    if (char.match(/[a-zA-Z]/)) {
      // Rotation de lettres aléatoire
      if (Math.random() < 0.2) {
        simulatedText.push(rotateLetter(char));
      } else {
        simulatedText.push(char);
      }
    } else {
      simulatedText.push(char);
    }
  }
  return simulatedText.join('');
}


function rotateLetter(letter) {
  const rotationMap = {
    b: 'd', d: 'b', p: 'q', q: 'p',
    n: 'u', u: 'n', m: 'w', w: 'm',
    v: 'y', y: 'v', e: 'a', a: 'e',
    // Vous pouvez ajouter plus de correspondances ici
  };
  return rotationMap[letter] || letter;
}

function simulateTextInElements(elements) {
  elements.forEach(element => {
    const originalText = element.textContent;
    const simulatedText = simulateDyslexia(originalText);
    element.textContent = simulatedText;
  });
}

function updateSimulatedText() {
  const allTextElements = document.querySelectorAll('li');
  simulateTextInElements(allTextElements);
}

let intervalCognitiveSimulation = setInterval(updateSimulatedText, 2000); // Mettre à jour toutes les 2 secondes
