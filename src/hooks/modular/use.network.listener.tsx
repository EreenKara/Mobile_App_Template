// useNetworkListener.ts
import {useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useNetworkListener(
  onReconnect: () => void,
  onDisconnect?: () => void,
  minInterval: number = 30000,
) {
  useEffect(() => {
    let lastNetworkTime = Date.now();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected == false) {
        onDisconnect?.();
        lastNetworkTime = Date.now();
      }
      if (state.isConnected && Date.now() - lastNetworkTime > minInterval) {
        onReconnect();
        lastNetworkTime = Date.now();
      }
    });
    return () => unsubscribe();
  }, [onReconnect, minInterval]);
}
