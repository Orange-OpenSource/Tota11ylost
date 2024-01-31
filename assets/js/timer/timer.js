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
        localStorage.setItem('timerFinish', Date.now());
    }
    currentTime = localStorage.getItem('timerFinish')
    document.getElementById('timerFinish').textContent = 'Vous venez de terminer l\'Escape Game en ' + getFormattedTime() + '.';

}

if (localStorage.getItem('timerFinish') === null) {
    const interval = setInterval(updateTimer, 1000);
}
// Update the timer every second




function updateTimer() {
    currentTime = Date.now();
    const formattedTime = getFormattedTime();
    timerElement.textContent = formattedTime;

}


function getFormattedTime() {
    const timeSpent = currentTime - startTime;



    const hours = Math.floor(timeSpent / (1000 * 60 * 60));
    const minutes = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeSpent % (1000 * 60)) / 1000);

    return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;

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
        setInterval(updateTimer, 1000);
    }
}

function addTime(second) {
    startTime = startTime - (second * 1000);
    localStorage.setItem('timerStartTime', startTime);
}