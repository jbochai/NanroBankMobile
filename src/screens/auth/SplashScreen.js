import React from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Gradients } from '../../styles/colors';  // Fixed path: ../ twice to get to src/

const SplashScreen = () => {
 return (
    <LinearGradient
      colors={Gradients.primary}
      style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator 
        size="large" 
        color={Colors.white} 
        style={styles.loader}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;

