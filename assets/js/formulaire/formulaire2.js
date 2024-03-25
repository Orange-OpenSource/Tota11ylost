let indice = 0;
const indiceText = [
  '',
  'Eh oui, pas facile de remplir un formulaire quand on a pas de label... Les labels ont maintenant été rajoutés.',
  'Ça peut être frustrant de ne pas savoir pourquoi on ne peut pas valider un formulaire. Laissez toujours la possibilité de valider le formulaire et ajoutez y des messages d\'erreurs !!!',
  'C\'est bien beau d\'avoir mis un message d\'erreur, mais s\'il n\'est pas précis il ne servira à rien. Les messages d\'erreurs doivent être précis et lié aux champs de formulaire afin de déterminer rapidement l\'erreur. Et voila des messages d\'erreurs ont été rajoutés.'
]


const indiceTime = [30, 120, 300, 0];

const nom = document.getElementById("pistache");
const nomErrordiv = document.getElementById("errorpistacheDiv");
const nomErrortext = document.getElementById("errorpistacheText");

const prenom = document.getElementById("cacahuete");
const prenomErrordiv = document.getElementById("errorcacahueteDiv");
const prenomErrortext = document.getElementById("errorcacahueteText");

const password = document.getElementById("olives");
const passwordErrordiv = document.getElementById("errorolivesDiv");
const passwordErrortext = document.getElementById("errorolivesText");

const age = document.getElementById("saucisson");
const ageErrordiv = document.getElementById("errorsaucissonDiv");
const ageErrortext = document.getElementById("errorsaucissonText");

const mail = document.getElementById("chips");
const mailErrordiv = document.getElementById("errorchipsDiv");
const mailErrortext = document.getElementById("errorchipsText");

const telephone = document.getElementById("tapenade");
const telephoneErrordiv = document.getElementById("errortapenadeDiv");
const telephoneErrortext = document.getElementById("errortapenadeText");

const fruits = document.querySelectorAll('[name="fruit"]');
const fruitErrordiv = document.getElementById("errorfruitDiv");
const fruitErrortext = document.getElementById("errorfruitText");
const legendFruit = document.getElementById('legendFruit');


const btnInscription = document.getElementById("inscription");
const btnIndice = document.getElementById('indice');

const alertError = document.getElementById('errorDiv');

btnIndice.addEventListener('click', (e) => {
  addTime(indiceTime[indice]);
  indice++;
  updateIndiceButton();

  switch (indice) {
    case 1:
      addIndice();
      addLabel();
      break;
    case 2:
      addIndice();
      btnInscription.disabled = false
      break;
    case 3:
      addIndice();
      document.getElementById('email').textContent += ' (format : nomprenom@domain.com)'
      document.getElementById('telephone').textContent += ' (format : +33 suivi de 9 chiffres)'
      legendFruit.textContent += ' (3 fruits)'
      e.target.disabled = true;

      break;
    default:
      console.log('plus d\'indice');
  }

});

btnInscription.addEventListener("click", (e) => {
  alertError.classList.add('d-none')
  if (!errorForm()) {
    document.location.assign('./6-1-formulaire.html');
  } else {
    nom.focus();
    if (indice === 2) {
      alertError.classList.remove('d-none')
      window.location.hash = '#errorDiv';
    }
  }

})


// on change event before indice 3
nom.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})
prenom.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})
password.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})
age.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})
mail.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})
telephone.addEventListener("change", (e) => {
  if (indice < 2) {
    errorForm();
  }
})


fruits.forEach(fruit => {
  fruit.addEventListener("change", (e) => {
    errorForm();
  })
})


function validateEmail(inputText) {
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return inputText.match(mailformat);
}

function valideTel(inputText) {

  let telformat = /^(\+33)(6|7)[0-9]{8}$/g;
  return inputText.match(telformat);
}

function errorForm() {
  let error = false;
  let ageInt = parseInt(age.value)

  nomError = "";
  prenomError = "";
  passwordError = "";
  ageError = "";
  mailError = "";
  telephoneError = "";


  nomErrordiv.classList.add('d-none');
  prenomErrordiv.classList.add('d-none');
  passwordErrordiv.classList.add('d-none');
  ageErrordiv.classList.add('d-none');
  mailErrordiv.classList.add('d-none');
  telephoneErrordiv.classList.add('d-none');
  fruitErrordiv.classList.add('d-none');

  if (nom.value == "") {
    error = true;

    if (indice === 3) {
      nomErrordiv.classList.remove('d-none');
      nomErrortext.textContent = "Le nom est obligatoire";
    }
  }
  if (prenom.value == "") {
    error = true;
    if (indice === 3) {
      prenomErrordiv.classList.remove('d-none');
      prenomErrortext.textContent = "Le prénom est obligatoire";
    }
  }
  if (password.value.length < 4 || password.value.length > 8) {
    error = true;
    if (indice === 3) {
      passwordErrordiv.classList.remove('d-none');
      passwordErrortext.textContent = "Le mot de passe doit être entre 4 et 8 caractères";
    }
  }
  if (isNaN(ageInt) || ageInt >= 18) {
    error = true;
    if (indice === 3) {
      ageErrordiv.classList.remove('d-none');
      ageErrortext.textContent = "L'age doit être un nombre inférieur à 18.";
    }
  }
  if (!validateEmail(mail.value)) {
    error = true;
    if (indice === 3) {
      mailErrordiv.classList.remove('d-none');
      mailErrortext.textContent = "Le format de l'email n'est pas valide. Exemple de format nomprenom@orange.com";
    }
  }
  if (!valideTel(telephone.value)) {
    error = true;
    if (indice === 3) {
      telephoneErrordiv.classList.remove('d-none');
      telephoneErrortext.textContent = "Le format du téléphone n'est pas valide. Exemple de format +33612345678";
    }
  }
  var nbfruit = 0;
  fruits.forEach(fruit => {
    if (fruit.checked == true) {
      nbfruit++;
    }
  })
  if (nbfruit != 3) {
    error = true;
    if (indice === 3) {
      fruitErrordiv.classList.remove('d-none');
      fruitErrortext.textContent = "Seuls 3 fruits doivent être sélectionnés !!!";
    }
  }

  if (indice < 2) {
    if (!error) {
      btnInscription.disabled = false;
    } else {
      btnInscription.disabled = true;
    }
  }

  return error;
}

function addIndice() {
  const indiceDiv = document.getElementById("indice" + indice);

  let para = document.createElement("p");
  let node = document.createTextNode(indiceText[indice]);
  para.appendChild(node);
  indiceDiv.appendChild(para);
  indiceDiv.classList.remove('d-none')
}

function updateIndiceButton() {
  let getIndiceTime = indiceTime[indice];
  let textTime = "";
  let durationTime = "";

  if (getIndiceTime < 60 && indiceTime !== 0) {
    textTime = "sec"
    durationTime = getIndiceTime;
  } else {
    textTime = "min";
    durationTime = getIndiceTime / 60;
  }
  btnIndice.textContent = "Prendre un indice (+" + durationTime + " " + textTime + ")";
}

function addLabel() {

  labelNom = document.createElement("LABEL");
  labelNom.id = "nom";
  labelNom.textContent = "Nom :";
  labelNom.setAttribute("for", "pistache")
  labelNom.classList.add("form-label");
  document.getElementById("pistacheDiv").prepend(labelNom);

  labelPrenom = document.createElement("LABEL");
  labelPrenom.id = "prenom";
  labelPrenom.textContent = "Prenom :";
  labelPrenom.setAttribute("for", "cacahuete")
  labelPrenom.classList.add("form-label");
  document.getElementById("cacahueteDiv").prepend(labelPrenom);

  labelPassword = document.createElement("LABEL");
  labelPassword.id = "password";
  labelPassword.textContent = "Mot de passe :";
  labelPassword.setAttribute("for", "olives")
  labelPassword.classList.add("form-label");
  document.getElementById("olivesDiv").prepend(labelPassword);

  labelAge = document.createElement("LABEL");
  labelAge.id = "age";
  labelAge.textContent = "Age :";
  labelAge.setAttribute("for", "saucisson")
  labelAge.classList.add("form-label");
  document.getElementById("saucissonDiv").prepend(labelAge);

  labelMail = document.createElement("LABEL");
  labelMail.id = "email";
  labelMail.textContent = "Email :";
  labelMail.setAttribute("for", "chips")
  labelMail.classList.add("form-label");
  document.getElementById("chipsDiv").prepend(labelMail);

  labelTelephone = document.createElement("LABEL");
  labelTelephone.id = "telephone";
  labelTelephone.textContent = "Téléphone :";
  labelTelephone.setAttribute("for", "tapenade")
  labelTelephone.classList.add("form-label");
  document.getElementById("tapenadeDiv").prepend(labelTelephone);


  legendFruit.textContent = "Sélectionnez vos fruits préférés :"


}

document.addEventListener('DOMContentLoaded', function () {
  btnInscription.disabled = true;
  updateIndiceButton();
})
