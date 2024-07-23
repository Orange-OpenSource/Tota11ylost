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
