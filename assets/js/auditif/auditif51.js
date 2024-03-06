let validButton = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
const href = './6-formulaire.html';

validButton.addEventListener("click", (e) => {
  const reponse = document.getElementById('reponse').value.toLowerCase();

  if (reponse === 'clair de lune' || reponse === 'sonate au clair de lune' || reponse === 'sonate 14') {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});
