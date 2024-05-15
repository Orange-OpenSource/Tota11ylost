const btnIndice = document.getElementById("indice");
const displayTimer = document.getElementById("displayTimer");
const hintsAvailable = document.getElementById("hintsAvailable");

const pageID = document.getElementById("pageId").value;

// Display timer before hint button activation
function startTimer(duration, display) {
  let start = Date.now(),
    diff,
    minutes,
    seconds;

  function timer() {
    diff = duration - (((Date.now() - start) / 1000) | 0);

    minutes = (diff / 60) % 60 | 0;
    seconds = diff % 60 | 0;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = " " + minutes + ":" + seconds;

    if (diff <= 0) {
      start = Date.now() + 1000;
    }
  }

  timer();
  setInterval(timer, 1000);
}

let display = document.querySelector("#hint-timer");

startTimer(5 * 60, display);

// Add param '?debug=true' at the end of the URL to reduce timer duration to 10s
let params = new URLSearchParams(document.location.search);
let debug = params.get("debug");
let hintTimer = !debug ? 300000 : 10000;

// Activate hint buttton and remove time after 5min
setTimeout(() => {
  btnIndice.removeAttribute("disabled");
  displayTimer.classList.add("d-none");
  hintsAvailable.classList.remove("d-none");
}, hintTimer);

// Hint system
let indice = 0;

const indiceTime = [30, 120, 300, 0];

btnIndice.addEventListener("click", (e) => {
  addTime(indiceTime[indice]);
  indice++;
  updateIndiceButton();

  switch (indice) {
    case 1:
      addIndice();
      break;
    case 2:
      addIndice();
      break;
    case 3:
      addIndice();
      e.target.disabled = true;
      e.target.innerHTML = i18next.t("hints.noMoreHints");
      break;
    default:
  }
});

function addIndice() {
  const indiceDiv = document.getElementById("indice" + indice);

  let para = document.createElement("p");
  let node = document.createTextNode(
    indice < 1
      ? ""
      : i18next.t("hints." + pageID, { returnObjects: true })[indice - 1]
  );

  para.appendChild(node);
  indiceDiv.appendChild(para);
  indiceDiv.classList.remove("d-none");
}

function updateIndiceButton() {
  let getIndiceTime = indiceTime[indice];
  let textTime = "";
  let durationTime = "";

  if (getIndiceTime < 60 && indiceTime !== 0) {
    textTime = "sec";
    durationTime = getIndiceTime;
  } else {
    textTime = "min";
    durationTime = getIndiceTime / 60;
  }
  btnIndice.textContent = i18next.t("form.labelHintsButton", {
    duration: durationTime,
    unit: textTime,
  });
}

// JS hack needed for Firefox in order to reset btnIndice to disabled state on soft refresh
// For reference, see https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing
window.addEventListener("pageshow", PageShowHandler, false);
window.addEventListener("unload", UnloadHandler, false);

function PageShowHandler() {
  btnIndice.setAttribute("disabled", true);
  window.addEventListener("unload", UnloadHandler, false);
}

function UnloadHandler() {
  window.removeEventListener("unload", UnloadHandler, false);
}
