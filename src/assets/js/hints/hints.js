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

const btnIndice = document.getElementById("indice");
const hintsAvailable = document.getElementById("hintsAvailable");
const pageID = document.getElementById("pageId").value;

// Add param '?debug=true' at the end of the URL to reduce timer duration to 10s
let params = new URLSearchParams(document.location.search);
let debug = params.get("debug");
let formRegistration = window.location.href.includes("form-registration");
let hintTimer = formRegistration ? 1 : (!debug ? 300000 : 10000);

// Activate hint buttton and remove time after 5min
setTimeout(() => {
  btnIndice.removeAttribute("disabled");
  hintsAvailable.classList.remove("d-none");
}, hintTimer);

// Hint system
let indice = 0;

const indiceTime = [30, 120, 300, 0];

btnIndice.addEventListener("click", (e) => {
  addTime(indiceTime[indice]);
  indice++;
  updateIndiceButton();

  switch (indice) {
    case 1:
      addIndice();
      break;
    case 2:
      addIndice();
      break;
    case 3:
      addIndice();
      e.target.disabled = true;
      e.target.innerHTML = i18next.t("hints.noMoreHints");
      break;
    default:
  }
});

function addIndice() {
  const indiceDiv = document.getElementById("indice" + indice);

  let para = document.createElement("p");
  let node = document.createTextNode(
    indice < 1
      ? ""
      : i18next.t("hints." + pageID, {returnObjects: true})[indice - 1]
  );

  para.appendChild(node);
  indiceDiv.appendChild(para);
  indiceDiv.classList.remove("d-none");
}

function updateIndiceButton() {
  let getIndiceTime = indiceTime[indice];
  let textTime = "";
  let durationTime = "";

  if (getIndiceTime < 60) {
    textTime = "sec";
    durationTime = getIndiceTime;
  } else {
    textTime = "min";
    durationTime = getIndiceTime / 60;
  }
  btnIndice.textContent = i18next.t("form.labelHintsButton", {
    duration: durationTime,
    unit: textTime,
  });
}

// JS hack needed for Firefox in order to reset btnIndice to disabled state on soft refresh
// For reference, see https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing
if (!formRegistration) {
  window.addEventListener("pageshow", PageShowHandler, false);
  window.addEventListener("unload", UnloadHandler, false);

  function PageShowHandler() {
    btnIndice.setAttribute("disabled", true);
    hintsAvailable.classList.add("d-none");
    window.addEventListener("unload", UnloadHandler, false);
  }

  function UnloadHandler() {
    window.removeEventListener("unload", UnloadHandler, false);
  }
}
