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

// Check if there's a previous start time stored in localStorage
let storedStartTime = localStorage.getItem('timerStartTime');
let startTime;
let currentTime;

if (storedStartTime) {
  startTime = parseInt(storedStartTime, 10);
} else {
  restartTime();
}

if (document.getElementById('finalTimer') !== null) {
  if (localStorage.getItem('timerFinish') === null) {
    localStorage.setItem('timerFinish', Date.now() + '');
  }
  currentTime = localStorage.getItem('timerFinish');
  const digits = timeToDigits(getTime());
  let htmlContent = '';
  if (digits[0]) {
    htmlContent += `
        <p class="fs-3 bg-black text-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[0]}</p>
        <p class="fs-3 fw-bold me-1" aria-hidden="true">:</p>`;
  }

  htmlContent += `
        <p class="fs-3 bg-black text-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[1]}</p>
        <p class="fs-3 bg-black text-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[2]}</p>
        <p class="fs-3 fw-bold me-1" aria-hidden="true">:</p>
        <p class="fs-3 bg-black text-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[3]}</p>
        <p class="fs-3 bg-black text-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[4]}</p>`;
  document.getElementById('finalTimer').innerHTML = htmlContent;

  // Add aria-live section for screen readers
  const ariaLiveContent = `
    <p class="visually-hidden" aria-live="polite" aria-atomic="true">
      ${getFormattedTime(getTime())}
    </p>`;
  document.getElementById('finalTimer').insertAdjacentHTML('beforeend', ariaLiveContent);
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
  const timerElement = document.getElementById('timer');
  if (timerElement) {
    let htmlContent = `<p class="fs-6 fw-bold text-light me-2">${i18next.t("common.timer.title")}</p>`;
    if (digits[0]) {
      htmlContent += `
        <p class="fs-3 bg-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[0]}</p>
        <p class="fs-3 text-white fw-bold me-1" aria-hidden="true">:</p>`;
    }
    htmlContent += `
        <p class="fs-3 bg-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[1]}</p>
        <p class="fs-3 bg-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[2]}</p>
        <p class="fs-3 text-white fw-bold me-1" aria-hidden="true">:</p>
        <p class="fs-3 bg-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[3]}</p>
        <p class="fs-3 bg-white rounded-1 fw-bold p-1 me-1" aria-hidden="true">${digits[4]}</p>`;
    timerElement.innerHTML = htmlContent;

    // Add aria-live section for screen readers
    const ariaLiveContent = `
      <p class="visually-hidden" aria-live="polite" aria-atomic="true">
        ${getFormattedTime(getTime())}
      </p>`;
    timerElement.insertAdjacentHTML('beforeend', ariaLiveContent);
  }
}

function timeToDigits(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const remainingMinutes = totalMinutes % 60;
  const tensOfMinutes = Math.floor(remainingMinutes / 10);
  const unitsOfMinutes = remainingMinutes % 10;

  const remainingSeconds = totalSeconds % 60;
  const tensOfSeconds = Math.floor(remainingSeconds / 10);
  const unitsOfSeconds = remainingSeconds % 10;

  return [totalHours, tensOfMinutes, unitsOfMinutes, tensOfSeconds, unitsOfSeconds];
}

function getFormattedTime(timeSpent) {
  const time = timeToDigits(timeSpent || getTime());
  return (time[0] ? (time[0] + ':') : '') + (time[1] || '0') + time[2] + ':' + time[3] + time[4];
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
