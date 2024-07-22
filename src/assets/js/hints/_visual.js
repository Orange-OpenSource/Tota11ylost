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

btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      addButtonsColors();
      break;
    default:
  }
});

function addButtonsColors() {
  const buttons = document.querySelectorAll('[id$="-button"]');

  buttons.forEach((button) => {
    button.classList.remove('btn-dark');
    button.classList.add('btn-info');

    const buttonId = button.getAttribute('id');

    if (buttonId.includes('blue')) {
        button.classList.add('blue-button');
    } else if (buttonId.includes('purple')) {
      button.classList.add('purple-button');
    } else if (buttonId.includes('green')) {
      button.classList.add('green-button');
    } else if (buttonId.includes('red')) {
      button.classList.add('red-button');
    }
  });
}
