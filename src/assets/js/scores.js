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

import {getBestScores, storePseudo} from "./firebase.js";

async function updateDisplay() {
  const pseudo = getPseudo();

  // Add param '?store=true' at the end of the URL to reduce timer duration to 10s
  let params = new URLSearchParams(document.location.search);
  let store = params.get('store');

  if (pseudo && pseudo.length > 0 && store) {
    console.log("store")
    await storePseudo(pseudo, getVersion());
  } else {
    console.log("not store")
  }
  await updateATable('todayTable', pseudo);
  await updateATable('generalTable', pseudo);
}

async function updateATable(table, pseudo) {
  clearScoreList(table);
  const scores = await getBestScores(table, getVersion());
  scores.forEach((data, position) => {
    const isCurrentPseudo = data.pseudo === pseudo;
    addScoreLine(table, data.pseudo, data.timer, position + 1, isCurrentPseudo);
  });
  scrollToCurrent();
}

function addScoreLine(tableId, pseudo, timer, position, isCurrent) {
  const tr = document.createElement('tr');

  let coupeImgHTML = '';
  switch (position) {
    case 1:
      coupeImgHTML = '<img src="../assets/img/rank=gold.svg" alt="" ' + (isCurrent ? 'class="zoom"' : '') + '>';
      break;
    case 2:
      coupeImgHTML = '<img src="../assets/img/rank=silver.svg" alt="" ' + (isCurrent ? 'class="zoom"' : '') + '>';
      break;
    case 3:
      coupeImgHTML = '<img src="../assets/img/rank=bronze.svg" alt="" ' + (isCurrent ? 'class="zoom"' : '') + '>';
      break;
  }

  // Declare default elements classes
  let cellPositionClasses = ['py-7', 'vertical-align'];
  let cellPseudoClasses = ['text-start', 'py-7'];
  let pseudoClasses = ['mb-0'];
  let timeClasses = ['mb-0', 'fs-6', isCurrent ? 'text-white' : 'text-body-secondary'];
  let cellTrophyClasses = ['py-7', 'vertical-align'];

  // Modify classes if the line is the current user
  if (isCurrent) {
    tr.id = 'current_' + tableId;

    cellPositionClasses.push('current', 'fs-5');
    cellPseudoClasses.push('current');
    pseudoClasses.push('fs-5');
  }

  // Create position cell
  const cellPosition = document.createElement('td');
  cellPosition.classList.add(...cellPositionClasses);
  cellPosition.innerText = position;
  tr.appendChild(cellPosition);

  // Create pseudo + time cell
  const cellPseudo = document.createElement('td');
  cellPseudo.classList.add(...cellPseudoClasses);
  const pPseudo = document.createElement('p');
  pPseudo.classList.add(...pseudoClasses);
  pPseudo.innerText = pseudo;
  cellPseudo.appendChild(pPseudo);
  const pTime = document.createElement('p');
  pTime.classList.add(...timeClasses);
  pTime.innerText = getFormattedTime(timer);
  cellPseudo.appendChild(pTime);
  tr.appendChild(cellPseudo);

  // Create trophy cell
  const cellTrophy = document.createElement('td');
  cellTrophy.classList.add(...cellTrophyClasses);
  cellTrophy.setAttribute('aria-hidden', 'true');
  cellTrophy.innerHTML = coupeImgHTML;
  tr.appendChild(cellTrophy);

  const tableBody = document.querySelector(`#${tableId} tbody`);
  tableBody.appendChild(tr);
}

function clearScoreList(list) {
  const scoreList = document.querySelector('#' + list + ' tbody');
  scoreList.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById('congratulationImage').alt = i18next.t('scores.alt_congratulationImage', {version: getVersion()});
  document.getElementById('version').innerHTML = getVersion();
});

await updateDisplay();

function scrollToCurrent() {
  const currentToday = document.getElementById('current_todayTable');
  if (currentToday) {
    currentToday.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const currentGeneral = document.getElementById('current_generalTable');
  if (currentGeneral) {
    currentGeneral.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
