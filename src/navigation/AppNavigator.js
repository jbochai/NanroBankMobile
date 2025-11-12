import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import { 
  selectIsAuthenticated, 
  selectIsLocked,
  checkAuthStatus 
} from '../store/auth/authSlice';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LockScreen from '../screens/auth/LockScreen';
import LoadingScreen from '../components/common/LoadingScreen';
import ActivityDetector from '../components/common/ActivityDetector';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLocked = useSelector(selectIsLocked);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await dispatch(checkAuthStatus()).unwrap();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
        if (SplashScreen) {
          SplashScreen.hide();
        }
      }
    };

    initAuth();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <ActivityDetector>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isLocked ? (
              <Stack.Screen name="Lock" component={LockScreen} />
            ) : (
              <Stack.Screen name="Main" component={MainNavigator} />
            )}
          </Stack.Navigator>
        </ActivityDetector>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;