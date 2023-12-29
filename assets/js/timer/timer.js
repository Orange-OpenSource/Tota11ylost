// Get the timer element
const timerElement = document.getElementById('timer');

// Check if there's a previous start time stored in localStorage
let storedStartTime = localStorage.getItem('timerStartTime');
let startTime;


if (storedStartTime) {

    startTime = parseInt(storedStartTime, 10);
} else {
    restartTime();
}

// Update the timer every second
const interval = setInterval(updateTimer, 1000);

function updateTimer() {
    const currentTime = Date.now();
    const timeSpent = currentTime - startTime;  
    
    

    const hours = Math.floor(timeSpent / (1000 * 60 * 60));
    const minutes = Math.floor((timeSpent % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeSpent % (1000 * 60)) / 1000);

    const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    timerElement.textContent = formattedTime;

}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function deleteTime(){
    localStorage.removeItem('timerStartTime');
    restartTime();
}

function restartTime(){
    // If no stored start time, set a new one
    startTime = Date.now();
    localStorage.setItem('timerStartTime', startTime);
}

function addTime (second){

}