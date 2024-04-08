import {getBestScores, storePseudo} from "./firebase.js";

async function updateDisplay() {
  const pseudo = getPseudo();

  if (pseudo && pseudo.length > 0) {
    await storePseudo(pseudo, getVersion());
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

  if (isCurrent) {
    tr.id = 'current_' + tableId;
    tr.innerHTML = `
        <td class="py-7 current fs-5 vertical-align">${position}</td>
        <td class="text-start py-7 current"><p class="mb-0 fs-5">${pseudo}</p><p class="mb-0 fs-6 text-white">${getFormattedTime(timer)}</p></td>
        <td class="py-7 current vertical-align" aria-hidden="true">${coupeImgHTML}</td>
    `;
  } else {
    tr.innerHTML = `
        <td class="py-7 vertical-align">${position}</td>
        <td class="text-start py-7"><p class="mb-0">${pseudo}</p><p class="mb-0 fs-6 text-body-secondary">${getFormattedTime(timer)}</p></td>
        <td class="py-7 vertical-align" aria-hidden="true">${coupeImgHTML}</td>
    `;
  }
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
