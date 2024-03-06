document.addEventListener('DOMContentLoaded', function () {
  const button30 = document.getElementById('30min');
  const button60 = document.getElementById('60min');
  const buttonStart = document.getElementById('start');

  button30.addEventListener('click', function () {
    setVersion('30');
  });
  button60.addEventListener('click', function () {
    setVersion('60');
  });
  buttonStart.addEventListener('click', function () {
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
  window.location.href = '1-introduction.html';
  restartTime();
}
