let validButton = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
const href = './form-registration.html';

validButton.addEventListener("click", (e) => {
  const userResponse = document.getElementById('reponse').value.toLowerCase();
  const possibleResponses = i18next.t('hearingSimu.possibleResponses', {returnObjects: true});
  const isCorrectResponse = possibleResponses.find(response => response === userResponse);

  if (isCorrectResponse) {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});
