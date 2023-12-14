const timerElement = document.getElementById("timer");
let timeRemaining = 3600; // 60 minutes in seconds
let isRunning = true;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateTimerDisplay() {
    timerElement.textContent = formatTime(timeRemaining);
    if (timeRemaining <= 0) {
        timerElement.style.color = "red";
    }
}

function updateTimer() {
    if (isRunning && timeRemaining > 0) {
        timeRemaining--;
        updateTimerDisplay();
    }
}

setInterval(updateTimer, 1000);