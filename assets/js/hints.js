const btnHint = document.getElementById("indice");
const displayTimer = document.getElementById("displayTimer");

function startTimer(duration, display) {
  var start = Date.now(),
    diff,
    minutes,
    seconds;

  function timer() {
    diff = duration - (((Date.now() - start) / 1000) | 0);

    minutes = (diff / 60) % 60 | 0;
    seconds = (diff % 60) | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (diff <= 0) {
      start = Date.now() + 1000;
    }
  };
  timer();
  setInterval(timer, 1000);
}

var display = document.querySelector('#time');
startTimer(5 * 60, display);

setTimeout(() => {
  btnHint.removeAttribute("disabled");
  displayTimer.classList.add("d-none");
}, 300000);
