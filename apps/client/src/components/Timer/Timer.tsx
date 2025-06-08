import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { styles } from './Timer.styles';

interface TimerProps {
  estimatedCompletionTime?: string;
  className?: string;
}

export const Timer: FC<TimerProps> = ({ estimatedCompletionTime, className }) => {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!estimatedCompletionTime) {
      console.debug('Timer: No estimatedCompletionTime provided');
      return;
    }

    console.debug('Timer: Initializing with completion time:', estimatedCompletionTime);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const completionTime = new Date(estimatedCompletionTime).getTime();
      const difference = completionTime - now;

      console.debug('Timer: Difference in ms:', difference);

      if (difference <= 0) {
        return { minutes: 0, seconds: 0 };
      }

      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      console.debug('Timer: Calculated time:', { minutes, seconds });
      return { minutes, seconds };
    };

    // Initial calculation
    const initialTime = calculateTimeLeft();
    console.debug('Timer: Setting initial time:', initialTime);
    setTimeLeft(initialTime);

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval when countdown reaches 0
      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        console.debug('Timer: Countdown complete');
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      console.debug('Timer: Cleaning up interval');
      clearInterval(timer);
    };
  }, [estimatedCompletionTime]);

  return (
    <div css={styles} className={className}>
      <div className="timer-container">
        <div className="timer-digits">
          {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </div>
        {/* <div className="timer-label">remaining</div> */}
      </div>
    </div>
  );
};
