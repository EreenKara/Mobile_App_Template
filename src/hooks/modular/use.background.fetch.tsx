// useBackgroundFetch.ts
import {useEffect} from 'react';

export function useBackgroundFetch(onFetch: () => void, interval: number) {
  useEffect(() => {
    const timer = setInterval(() => {
      onFetch();
    }, interval);
    return () => clearInterval(timer);
  }, [onFetch, interval]);
}
