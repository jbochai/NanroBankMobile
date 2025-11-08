import { useEffect } from 'react';
import { PanResponder } from 'react-native';
import useIdleTimer from '../../hooks/useIdleTimer';

const ActivityDetector = ({ children }) => {
  const { resetTimer } = useIdleTimer();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => {
      resetTimer();
      return false;
    },
    onMoveShouldSetPanResponder: () => {
      resetTimer();
      return false;
    },
  });

  return children;
};

export default ActivityDetector;