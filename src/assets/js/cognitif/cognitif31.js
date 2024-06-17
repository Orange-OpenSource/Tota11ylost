let validButton = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
const href = "./physical.html";

validButton.addEventListener("click", (e) => {
  const first = document.getElementById('premier').value.toLowerCase();
  const second = document.getElementById('deuxieme').value.toLowerCase();
  const third = document.getElementById('troisieme').value.toLowerCase();

  const listOfResponses = i18next.t('cognitiveSimu.listOfResponses', {returnObjects: true});

  if (first.indexOf(listOfResponses[0]) > -1 && second.indexOf(listOfResponses[1]) > -1 && third.indexOf(listOfResponses[2]) > -1) {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});
