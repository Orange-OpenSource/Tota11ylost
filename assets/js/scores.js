import {getBestScores, storePseudo} from "./firebase.js";

async function updateDisplay() {
  const pseudo = getPseudo();

  if (pseudo && pseudo.length > 0) {
    await storePseudo(pseudo, getVersion());
  }
  await updateATable('todayTable', pseudo);
  await updateATable('allTimeTable', pseudo);
}

async function updateATable(table, pseudo) {
  clearScoreList(table);
  const scores = await getBestScores(table, getVersion());
  scores.forEach((data, position) => {
    const isCurrentPseudo = data.pseudo === pseudo;
    if (table === 'allTimeTable' || position < 4 || isCurrentPseudo) {
      addScoreLine(table, data.pseudo, data.timer, position + 1, isCurrentPseudo);
    }
  });
}

function addScoreLine(list, pseudo, timer, position, bold) {
  const tr = document.createElement('tr');

  let coupeImgHTML = '';
  switch (position) {
    case 1:
      coupeImgHTML = '<img src="assets/img/PixelArts/Coupe-or.png" alt="Premier au classement du jour">';
      break;
    case 2:
      coupeImgHTML = '<img src="assets/img/PixelArts/Coupe-argent.png" alt="Deuxième au classement du jour">';
      break;
    case 3:
      coupeImgHTML = '<img src="assets/img/PixelArts/Coupe-bronze.png" alt="Troisième au classement du jour">';
      break;
  }

  tr.innerHTML = `
        <td>${coupeImgHTML}</td>
        <td>${position}</td>
        <td>${pseudo}</td>
        <td>${getFormattedTime(timer)}</td>
    `;

  if (bold) {
    tr.classList.add('fw-bold');
  }

  const tableBody = document.querySelector(`#${list} tbody`);
  tableBody.appendChild(tr);
}

function clearScoreList(list) {
  const scoreList = document.querySelector('#' + list + ' tbody');
  scoreList.innerHTML = '';
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById('hallOfFame').innerHTML = 'Tableau des scores (' + getVersion() + ' min)';
});

await updateDisplay();
