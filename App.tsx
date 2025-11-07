/**
 * Nanro Bank Mobile App
 * Main Application Entry Point
 * 
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

// Import store
import { store, persistor } from './src/store';

// Import navigators
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

// Import screens
import SplashScreen from './src/screens/auth/SplashScreen';

// Import selectors
import { selectIsAuthenticated } from './src/store/auth/authSlice';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

// AppContent component that uses Redux
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Simulate initial app load
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
};

// Main App component
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;