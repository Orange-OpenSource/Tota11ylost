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
