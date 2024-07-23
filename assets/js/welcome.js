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

document.addEventListener('DOMContentLoaded', function () {
  const button15 = document.getElementById('15min');
  const button30 = document.getElementById('30min');
  const button60 = document.getElementById('60min');

  button15.addEventListener('click', function () {
    setVersion('15');
  });
  button30.addEventListener('click', function () {
    setVersion('30');
  });
  button60.addEventListener('click', function () {
    setVersion('60');
  });

  const myForm = document.getElementById('myForm');
  myForm.addEventListener('submit', function () {
    event.preventDefault();
    const pseudo = document.getElementById('pseudo').value;
    if (pseudo.length > 0) {
      setPseudo(pseudo);
      startAdventure();
    } else {
      console.error('empty username');
    }
  });
});

function startAdventure() {
  window.location.href = '/pages/introduction.html';
  restartTime();
}

setVersion('15');
