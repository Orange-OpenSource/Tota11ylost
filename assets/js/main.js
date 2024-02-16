
function setPseudo(pseudo) {
    localStorage.setItem('pseudo', pseudo);
}

function getPseudo() {
    return localStorage.getItem('pseudo');
}

function setVersion(time) {
    localStorage.setItem('version', time);
}

function getVersion() {
    return localStorage.getItem('version');
}

function updateRankingVersion() {
    document.getElementById('hallOfFame').innerHTML = 'Tableau des scores ('+ getVersion() + ' min)';
}