const overlay = document.getElementById('overlay');
const content = document.getElementById('content');

function getRandomImageURL() {
  // Remplacez par vos URLs d'images réelles
  const imageUrls = [
    "./assets/img/cognitif/a11ybaba.png",
    "./assets/img/cognitif/alice.png",
    "./assets/img/cognitif/calc.png",
    "./assets/img/cognitif/ce-soir.png",
    "./assets/img/cognitif/coude.png",
    "./assets/img/cognitif/game-master.jpg",
    "./assets/img/cognitif/grinch-3.png",
    "./assets/img/cognitif/helico.png",
    "./assets/img/cognitif/hungry.png",
    "./assets/img/cognitif/impots.png",
    "./assets/img/cognitif/monkey.png",
    "./assets/img/cognitif/nyan-cat.png",
    "./assets/img/cognitif/petit-dej.png",
    "./assets/img/cognitif/porte_ferme.png",
    "./assets/img/cognitif/voisin.png",
    "./assets/img/cognitif/woof.png",
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

function showOverlay() {
  langManager.subscribe(
    () => {
      content.innerHTML = `<img src="${getRandomImageURL()}" alt="${i18next.t('cognitifSimu.alt_simulatedImage')}">`;
      overlay.style.display = 'flex';
    }
  )

  // Générer un délai aléatoire entre 2 et 10 secondes
  const randomDelay = Math.random() * (5000 - 3000) + 2000;

  setTimeout(hideOverlay, randomDelay); // Masquer après le délai aléatoire
}

function hideOverlay() {
  overlay.style.display = 'none';

  // Générer un délai aléatoire entre 2 et 10 secondes pour réafficher
  const randomDelay = Math.random() * (5000 - 3000) + 2000;

  setTimeout(showOverlay, randomDelay); // Afficher à nouveau après le délai aléatoire
}

showOverlay();
