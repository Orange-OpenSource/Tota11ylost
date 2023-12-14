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
    b: 'd', d: 'b', 
    n: 'u', u: 'n',
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

setInterval(updateSimulatedText, 4000); // Mettre à jour toutes les 2 secondes