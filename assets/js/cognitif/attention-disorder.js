const overlay = document.getElementById('overlay');
const content = document.getElementById('content');

function getRandomImage() {
  const images = [
    {url: "../../assets/img/cognitive/A11yce.jpg",
      text: i18next.t('cognitiveSimu.img_alice'),
      color: 'yellow',
      size: '50px',
      top: '290px',
      opacity: true
    },
    {url: "../../assets/img/cognitive/calc.png"},
    {url: "../../assets/img/cognitive/game-master.jpg"},
    {url: "../../assets/img/cognitive/grinch-3.png"},
    {url: "../../assets/img/cognitive/hungry.jpg",
      text: i18next.t('cognitiveSimu.img_hungry'),
      color: 'red',
      size: '100px'
    },
    {url: "../../assets/img/cognitive/monkey.jpg",
      text: i18next.t('cognitiveSimu.img_monkey'),
      color: 'blue',
      size: '80px',
      top: '100px'
    },
    {url: "../../assets/img/cognitive/nyan-cat.png"},
    {url: "../../assets/img/cognitive/woof.png"},
  ]
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

function showOverlay() {
  langManager.subscribe(
    () => {
      const myImage = getRandomImage();

      content.innerHTML = `
  <div class="position-relative text-white">
    <img src="${myImage.url}" alt="${i18next.t('cognitifSimu.alt_simulatedImage')}" class="img-fluid">
    <div class="position-absolute p-4" style="${myImage.opacity ? ('background-color: #00000050') : ''}; color: ${myImage.color || 'black'}; top: ${myImage.top || 0}; ; font-size: ${myImage.size || 0};">
      ${myImage.text || ''}
    </div>
  </div>
  `
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
