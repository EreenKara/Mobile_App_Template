// useAppStateListener.ts
import {useEffect} from 'react';
import {AppState} from 'react-native';

export function useAppStateListener(
  onForeground: () => void,
  minInterval: number = 30000,
) {
  useEffect(() => {
    let lastActiveTime = Date.now();
    const listener = AppState.addEventListener('change', nextAppState => {
      if (
        nextAppState === 'active' &&
        Date.now() - lastActiveTime > minInterval
      ) {
        onForeground();
        lastActiveTime = Date.now();
      }
    });
    return () => listener.remove();
  }, [onForeground, minInterval]);
}
