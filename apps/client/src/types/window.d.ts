interface Window {
  __timerIntervals: {
    [key: number]: ReturnType<typeof setInterval>;
  };
}
