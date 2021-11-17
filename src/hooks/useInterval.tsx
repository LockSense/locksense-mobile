import { useEffect, useRef } from 'react';

// Credit: https://overreacted.io/making-setinterval-declarative-with-react-hooks/

type Callback = () => void;
const EMPTY_CALLBACK = () => {};

function useInterval(callback: Callback, delay: number | null) {
  const savedCallback = useRef<Callback>(EMPTY_CALLBACK);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default useInterval;
