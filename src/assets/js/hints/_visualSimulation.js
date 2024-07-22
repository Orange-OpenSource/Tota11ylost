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
      disableAllStyles();
      break;
    default:
  }
});

function disableAllStyles() {
  let cssFiles = document.querySelectorAll('link[href*=".css"]');

  cssFiles.forEach((file) => {
    file.setAttribute("disabled", "true");
  });
}
