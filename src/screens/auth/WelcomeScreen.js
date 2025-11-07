import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/common/Button';
import { Colors, Gradients } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <LinearGradient
        colors={Gradients.primary}
        style={styles.gradient}>
        
        <Animatable.View
          animation="fadeInDown"
          duration={1000}
          style={styles.logoContainer}>
          <View style={styles.logoCircle}>
          <Image 
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
          <Text style={styles.brandName}>Nanro Bank</Text>
          <Text style={styles.tagline}>Banking Made Simple</Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={500}
          duration={1000}
          style={styles.content}>
          <Text style={styles.title}>Welcome to Modern Banking</Text>
          <Text style={styles.subtitle}>
            Experience secure, fast, and convenient banking at your fingertips
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('Register')}
              gradient
              size="large"
            />
            <Button
              title="I Have an Account"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
              size="large"
              style={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
          </View>
        </Animatable.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl * 3,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoImage: {
  width: 50,
  height: 50,
},
  logoText: {
    fontSize: 40,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  brandName: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.semiBold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: Spacing.xl * 2,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderColor: Colors.white,
    borderWidth: 2,
  },
  loginButtonText: {
    color: Colors.white,
  },
});

export default WelcomeScreen;

