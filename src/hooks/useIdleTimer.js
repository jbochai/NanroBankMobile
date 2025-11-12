import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useDispatch } from 'react-redux';
import { lockScreen } from '../store/auth/authSlice';

const useIdleTimer = (timeout = 5 * 60 * 1000) => { // 5 minutes default
  const timeoutRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const dispatch = useDispatch();

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      dispatch(lockScreen());
    }, timeout);
  };

  const handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to the foreground
      resetTimer();
    } else if (nextAppState.match(/inactive|background/)) {
      // App has gone to the background
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

    appState.current = nextAppState;
  };

  useEffect(() => {
    resetTimer();

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      subscription.remove();
    };
  }, []);

  return { resetTimer };
};

export default useIdleTimer;