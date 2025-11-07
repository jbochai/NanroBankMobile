import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const Header = ({
  title,
  subtitle,
  showBack = true,
  onBackPress,
  rightComponent,
  backgroundColor = Colors.white,
  textColor = Colors.text,
  style,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === Colors.white ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />
      <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor }]}>
        <View style={[styles.container, style]}>
          {showBack && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="arrow-back" size={24} color={textColor} />
            </TouchableOpacity>
          )}

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>

          {rightComponent && <View style={styles.rightComponent}>{rightComponent}</View>}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: Spacing.xs,
    marginRight: Spacing.sm,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    marginTop: 2,
  },
  rightComponent: {
    marginLeft: Spacing.sm,
  },
});

export default Header;