let startTime;
let elapsedTime = 0;
let timerInterval;
const timeDisplay = document.getElementById("timeDisplay");

function updateTime() {
  const now = Date.now();
  elapsedTime = now - startTime;
  const time = new Date(elapsedTime);
  const hours = String(time.getUTCHours()).padStart(2, "0");
  const minutes = String(time.getUTCMinutes()).padStart(2, "0");
  const seconds = String(time.getUTCSeconds()).padStart(2, "0");
  timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

document.getElementById("startBtn").addEventListener("click", () => {
  if (!timerInterval) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 1000);
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

document.getElementById("resetBtn").addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  elapsedTime = 0;
  timeDisplay.textContent = "00:00:00";
});
