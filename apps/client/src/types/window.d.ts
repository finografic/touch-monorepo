interface Window {
  __timerIntervals: {
    [key: number]: ReturnType<typeof setInterval>;
  };
}

// Initialize the intervals object
window.__timerIntervals = window.__timerIntervals || {};
