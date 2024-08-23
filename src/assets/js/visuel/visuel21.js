/*
Software Name: Tota11ylost
SPDX-FileCopyrightText: Copyright (c) Orange SA
SPDX-License-Identifier: AGPL-3.0-or-later

This software is distributed under the GNU Affero General Public License v3.0 or later,
the text of which is available at https://opensource.org/license/agpl-v3
or see the "LICENSE" file for more details.

Authors: See CONTRIBUTORS.txt file
Software description: Experience in a playful way the challenges faced by people with digital disabilities
*/

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
      const noAccentName= accessibleName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      textBloc.innerHTML = br.braille(noAccentName);
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

  if (nom === i18next.t('visualSimu.name') && prenom === i18next.t('visualSimu.firstName') && naissance === i18next.t('visualSimu.birthDate') && mort === i18next.t('visualSimu.deathDate') && i18next.t('visualSimu.deathCity', {returnObjects: true}).find(response => response === ville)) {
    nextlink.innerText = i18next.t('visualSimu.congratulations');
    nextlink.href = is30Version() ? "./scores.html?store=true" : "./cognitive.html";
  } else {
    nextlink.innerText = i18next.t('visualSimu.error');
    nextlink.href = "";
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("autofocus").focus();
});
