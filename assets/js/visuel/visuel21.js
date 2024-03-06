let inputState = null;

document.addEventListener("click", handleClick);
document.addEventListener("keyup", handleKey);

function handleClick() {
  inputState = "mouse";
}

function handleKey() {
  inputState = "keyboard";
}

let textBloc = document.getElementById('text-bloc');

function updateTextBloc(event) {
  setTimeout(() => {
    if (inputState === "mouse") {
      return;
    }
    var target = event.target;
    var accessibleName = target.getAttribute('aria-label') || target.innerText || target.value || '';

    if (target.getAttribute("class") == "form-input") {
      textBloc.innerHTML = br.braille(accessibleName);
    } else textBloc.innerHTML = accessibleName;
  }, "200");


}

document.addEventListener('focusin', updateTextBloc);


let formInputs = document.querySelectorAll('.form-input');
let nextlink = document.getElementById('valider');

formInputs.forEach(input => {
  input.addEventListener('input', () => {
    validateForm();
  });
});

function validateForm() {
  let nom = document.getElementById('nom').value.toLowerCase();
  let prenom = document.getElementById('prenom').value.toLowerCase();
  let naissance = document.getElementById('naissance').value;
  let mort = document.getElementById('mort').value;
  let ville = document.getElementById('ville').value.toLowerCase();

  if (nom === 'braille' && prenom === 'louis' && naissance === '04/01/1809' && mort === '06/01/1852' && ville === 'panthéon' || ville === 'pantheon') {
    nextlink.innerText = "Bravo!!! Vous pouvez appuyer sur la touche \"Entrée\" pour passer à l'épreuve suivante suivante !!!";
    nextlink.href = "./3-cognitif.html";
  } else {
    nextlink.innerText = "Aïe le test n'est toujours pas réussi, vous ne pouvez pas valider l'épreuve !!!";
    nextlink.href = "";
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("autofocus").focus();
});
