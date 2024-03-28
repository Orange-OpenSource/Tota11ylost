let indice = 0;

const indiceTime = [15, 300, 300, 0];

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
      document.getElementById('email').textContent += ' ' + i18next.t('form.detailEmail');
      document.getElementById('telephone').textContent += ' ' + i18next.t('form.detailPhoneNumber');
      legendFruit.textContent += ' ' + i18next.t('form.detailFruits');
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
      nomErrortext.textContent = i18next.t('form.errorName');
    }
  }
  if (prenom.value == "") {
    error = true;
    if (indice === 3) {
      prenomErrordiv.classList.remove('d-none');
      prenomErrortext.textContent = i18next.t('form.errorFirstName');
    }
  }
  if (password.value.length < 4 || password.value.length > 8) {
    error = true;
    if (indice === 3) {
      passwordErrordiv.classList.remove('d-none');
      passwordErrortext.textContent = i18next.t('form.errorPassword');
    }
  }
  if (isNaN(ageInt) || ageInt >= 18) {
    error = true;
    if (indice === 3) {
      ageErrordiv.classList.remove('d-none');
      ageErrortext.textContent = i18next.t('form.errorAge');
    }
  }
  if (!validateEmail(mail.value)) {
    error = true;
    if (indice === 3) {
      mailErrordiv.classList.remove('d-none');
      mailErrortext.textContent = i18next.t('form.errorEmail');
    }
  }
  if (!valideTel(telephone.value)) {
    error = true;
    if (indice === 3) {
      telephoneErrordiv.classList.remove('d-none');
      telephoneErrortext.textContent = i18next.t('form.errorPhoneNumber');
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
      fruitErrortext.textContent = i18next.t('form.errorFruits');
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
  let node = document.createTextNode(indice < 1 ? '' : i18next.t('form.hints', {returnObjects: true})[indice - 1]);

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
  btnIndice.textContent = i18next.t('form.labelHintsButton', {duration: durationTime, unit: textTime});
}

function addLabel() {

  labelNom = document.createElement("LABEL");
  labelNom.id = "nom";
  labelNom.textContent = i18next.t('form.labelName');
  labelNom.setAttribute("for", "pistache")
  labelNom.classList.add("form-label");
  document.getElementById("pistacheDiv").prepend(labelNom);

  labelPrenom = document.createElement("LABEL");
  labelPrenom.id = "prenom";
  labelPrenom.textContent = i18next.t('form.labelFirstName');
  labelPrenom.setAttribute("for", "cacahuete")
  labelPrenom.classList.add("form-label");
  document.getElementById("cacahueteDiv").prepend(labelPrenom);

  labelPassword = document.createElement("LABEL");
  labelPassword.id = "password";
  labelPassword.textContent = i18next.t('form.labelPassword');
  labelPassword.setAttribute("for", "olives")
  labelPassword.classList.add("form-label");
  document.getElementById("olivesDiv").prepend(labelPassword);

  labelAge = document.createElement("LABEL");
  labelAge.id = "age";
  labelAge.textContent = i18next.t('form.labelAge');
  labelAge.setAttribute("for", "saucisson")
  labelAge.classList.add("form-label");
  document.getElementById("saucissonDiv").prepend(labelAge);

  labelMail = document.createElement("LABEL");
  labelMail.id = "email";
  labelMail.textContent = i18next.t('form.labelEmail');
  labelMail.setAttribute("for", "chips")
  labelMail.classList.add("form-label");
  document.getElementById("chipsDiv").prepend(labelMail);

  labelTelephone = document.createElement("LABEL");
  labelTelephone.id = "telephone";
  labelTelephone.textContent = i18next.t('form.labelPhoneNumber');
  labelTelephone.setAttribute("for", "tapenade")
  labelTelephone.classList.add("form-label");
  document.getElementById("tapenadeDiv").prepend(labelTelephone);


  legendFruit.textContent = i18next.t('form.labelFruits');


}

document.addEventListener('DOMContentLoaded', function () {
  btnInscription.disabled = true;
  updateIndiceButton();
})
