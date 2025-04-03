import {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkState() {
  const [networkState, setNetworkState] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async netState => {
        
      if (netState.isConnected) {
        await NetInfo.fetch();
        if (netState.isInternetReachable) {
          setNetworkState(true);
        }
      } else {
        setNetworkState(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return networkState;
}
