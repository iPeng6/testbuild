import { useState, useCallback, useRef, useEffect } from 'react';

const Status = {
  initial: 'initial',
  walking: 'walking',
  stop: 'stop',
};

function useStopwatch({ initTime, onChange, onStop }) {
  const [time, setTime] = useState(initTime);
  const [status, setStatus] = useState(Status.initial);
  const intervRef = useRef();

  const start = useCallback(() => {
    if (!intervRef.current) {
      intervRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 0) {
            stop();
            onStop && onStop();
            return prevTime;
          }
          onChange && onChange();
          return prevTime - 1;
        });
        return intervRef.current;
      }, 1000);
    }
    setTime(initTime);
    setStatus(Status.walking);
  }, [initTime, onChange, onStop, stop]);

  const stop = useCallback(() => {
    intervRef.current && clearInterval(intervRef.current);
    intervRef.current = null;
    setStatus(Status.stop);
  }, []);

  const clear = useCallback(() => {
    intervRef.current && clearInterval(intervRef.current);
    intervRef.current = null;
    setStatus(Status.initial);
  }, []);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  return { time, start, stop, clear, status, Status };
}

export default useStopwatch;
