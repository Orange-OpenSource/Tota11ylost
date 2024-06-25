function setPseudo(pseudo) {
  localStorage.setItem('pseudo', pseudo);
}

function getPseudo() {
  return localStorage.getItem('pseudo');
}

function setVersion(time) {
  localStorage.setItem('version', time);
}

function getVersion() {
  return localStorage.getItem('version');
}

function is30Version() {
  return localStorage.getItem('version') === '30';
}

function is15Version() {
  return localStorage.getItem('version') === '15';
}

document.addEventListener("DOMContentLoaded", (event) => {
  langManager.subscribe(() => {
    const link = document.getElementById('link30or60');
    if (link && is30Version()) {
      switch (link.href.split('/').pop()) {
        case 'visual.html':
          link.href = 'visual-simulation.html';
          break;
        case 'physical-simulation.html':
          link.href = 'hearing.html';
          break;
        default:
          break;
      }
    }
    if (link && is15Version()) {
      switch (link.href.split('/').pop()) {
        case 'physical-simulation.html':
          link.href = 'form-registration.html';
          break;
        default:
          break;
      }
    }
  })
})
