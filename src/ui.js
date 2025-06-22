// UI/UX: Idle mode to hide UI elements
let idleTimer = null;
const IDLE_TIMEOUT = 10000; // 10 seconds of inactivity

function resetIdleTimer() {
    if (idleTimer) {
        clearTimeout(idleTimer);
    }
    document.body.classList.remove('idle-mode');
    idleTimer = setTimeout(() => {
        document.body.classList.add('idle-mode');
    }, IDLE_TIMEOUT);
}

// Add event listeners for user activity and initialize idle timer
export function setupUI() {
    ['mousemove', 'mousedown', 'touchstart', 'scroll', 'keypress'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });

    // Initial call to start the timer
    resetIdleTimer();
}
let idleTimer = null;
const IDLE_TIMEOUT = 10000; // 10 seconds of inactivity

export function resetIdleTimer() {
    if (idleTimer) {
        clearTimeout(idleTimer);
    }
    document.body.classList.remove('idle-mode');
    idleTimer = setTimeout(() => {
        document.body.classList.add('idle-mode');
    }, IDLE_TIMEOUT);
}

// Add event listeners for user activity to reset the timer
export function setupUIActivityListeners() {
    ['mousemove', 'mousedown', 'touchstart', 'scroll', 'keypress'].forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
    });

    // Initial call to start the timer
    resetIdleTimer();
}