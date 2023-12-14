const overlay = document.getElementById('overlay');
const content = document.getElementById('content');

function getRandomImageURL() {
  // Remplacez par vos URLs d'images réelles
  const imageUrls = [
    "./assets/img/Porte_ferme.png",
    "./assets/img/Hungry.png",
    "./assets/img/voisin.png",
    "./assets/img/monkey.png",
    "./assets/img/calc.png",
    "./assets/img/A11ybaba.png",
    "./assets/img/alice.png",
    "./assets/img/petit-dej.png",
    "./assets/img/coude.png",
    "./assets/img/ce-soir.png",
    "./assets/img/helico.png",
    "./assets/img/nyan-cat.png",
    "./assets/img/impots.png",
    "./assets/img/grinch-3.png",
    "./assets/img/game-master.jpg",
    "./assets/img/woof.png",
  ];
  const randomIndex = Math.floor(Math.random() * imageUrls.length);
  return imageUrls[randomIndex];
}

function showOverlay() {
  content.innerHTML = `<img src="${getRandomImageURL()}" alt="Image simulée">`;
  overlay.style.display = 'flex';

  // Générer un délai aléatoire entre 2 et 10 secondes
  const randomDelay = Math.random() * (5000 - 3000) + 2000;

  setTimeout(hideOverlay, randomDelay); // Masquer après le délai aléatoire
}

function hideOverlay() {
  overlay.style.display = 'none';

  // Générer un délai aléatoire entre 2 et 10 secondes pour réafficher
  const randomDelay = Math.random() * (5000- 3000) + 2000;

  setTimeout(showOverlay, randomDelay); // Afficher à nouveau après le délai aléatoire
}

showOverlay();