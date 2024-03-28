// Get the timer element
const timerElement = document.getElementById('timer');

// Check if there's a previous start time stored in localStorage
let storedStartTime = localStorage.getItem('timerStartTime');
let startTime;
let currentTime;


if (storedStartTime) {

  startTime = parseInt(storedStartTime, 10);
} else {
  restartTime();
}

if (document.getElementById('timerFinish') !== null) {


  if (localStorage.getItem('timerFinish') === null) {
    localStorage.setItem('timerFinish', Date.now() + '');
  }
  currentTime = localStorage.getItem('timerFinish');

  langManager.subscribe(
    () => document.getElementById('timerFinish').textContent = i18next.t('scores.finished', {duration: getFormattedTime()})
  )
}

if (localStorage.getItem('timerFinish') === null) {
  langManager.subscribe(
    () => {
      updateTimer();
    });
  const interval = setInterval(updateTimer, 1000);
}

// Update the timer every second
function updateTimer() {
  currentTime = Date.now();
  const digits = timeToDigits(getTime());
  if (timerElement) {
    timerElement.innerHTML = `<div class="fs-6 fw-bold text-body-secondary me-2">${i18next.t("common.timer.title")}</div>
        <div class="fs-3 bg-white rounded-1 fw-bold p-1 me-1">${digits[0]}</div>
        <div class="fs-3 bg-white rounded-1 fw-bold p-1 me-1">${digits[1]}</div>
        <div class="fs-3 text-white fw-bold me-1">:</div>
        <div class="fs-3 bg-white rounded-1 fw-bold p-1 me-1">${digits[2]}</div>
        <div class="fs-3 bg-white rounded-1 fw-bold p-1 me-1">${digits[3]}</div>`;
  }
}

function timeToDigits(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const remainingSeconds = totalSeconds % 60;

  const tensOfMinutes = Math.floor(totalMinutes / 10);
  const unitsOfMinutes = totalMinutes % 10;

  const tensOfSeconds = Math.floor(remainingSeconds / 10);
  const unitsOfSeconds = remainingSeconds % 10;

  return [tensOfMinutes, unitsOfMinutes, tensOfSeconds, unitsOfSeconds];
}

function getFormattedTime(timeSpent) {
  if (!timeSpent) {
    timeSpent = getTime();
  }

  const hours = Math.floor(timeSpent / (1000 * 60 * 60));
  const minutes = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeSpent % (1000 * 60)) / 1000);

  return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

}

function getTime() {
  return currentTime - startTime;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function deleteTime() {
  localStorage.removeItem('timerStartTime');
  restartTime();
}

function restartTime() {
  // If no stored start time, set a new one
  startTime = Date.now();
  localStorage.setItem('timerStartTime', startTime);
  if (localStorage.getItem('timerFinish') !== null) {
    localStorage.removeItem('timerFinish');
    updateTimer();
    setInterval(updateTimer, 1000);
  }
}

function addTime(second) {
  startTime = startTime - (second * 1000);
  localStorage.setItem('timerStartTime', startTime);
}
