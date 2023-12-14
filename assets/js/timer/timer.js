// Get the timer element
const timerElement = document.getElementById('timer');

// Check if there's a previous start time stored in localStorage
const storedStartTime = localStorage.getItem('timerStartTime');
let targetTime;

if (storedStartTime) {
    targetTime = parseInt(storedStartTime, 10);
} else {
    // If no stored start time, set a new one (e.g., 5 minutes from now)
    targetTime = Date.now() + 60 * 60 * 1000; // 5 minutes in milliseconds
    localStorage.setItem('timerStartTime', targetTime);
}

// Update the timer every second
const interval = setInterval(updateTimer, 1000);

function updateTimer() {
    const currentTime = Date.now();
    const timeLeft = targetTime - currentTime;

    if (timeLeft <= 0) {
        clearInterval(interval);
        timerElement.textContent = "Fin du temps imparti";
    } else {
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const formattedTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        timerElement.textContent = formattedTime;
    }
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

function deleteTime(){
    localStorage.removeItem('timerStartTime');
}