// Simple global state for TimePage time that works with React rendering
let currentTimePageSeconds: number = 60; // Default 1 minute

export const timePageState = {
  getTime: () => {
    console.log('timePageState.getTime(): returning', currentTimePageSeconds, 'seconds');
    return currentTimePageSeconds;
  },
  setTime: (seconds: number) => {
    console.log('timePageState.setTime(): setting to', seconds, 'seconds (was', currentTimePageSeconds, ')');
    currentTimePageSeconds = seconds;
  },
};
