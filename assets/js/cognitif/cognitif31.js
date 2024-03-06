let validButton = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
const href = "./4-moteur.html";

validButton.addEventListener("click", (e) => {
  const premier = document.getElementById('premier').value.toLowerCase();
  const deuxième = document.getElementById('deuxieme').value.toLowerCase();
  const troisième = document.getElementById('troisieme').value.toLowerCase();

  if (premier === 'albert einstein' || premier === 'einstein' && deuxième === 'agatha christie' || deuxième === 'christie' && troisième === 'charles darwin' || troisième === 'darwin') {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});
