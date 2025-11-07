/**
 * Font configuration for Nanro Bank Mobile App
 */

// Font families
export const FontFamilies = {
  // iOS fonts
  ios: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
    light: 'System',
  },
  // Android fonts
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semiBold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    light: 'Roboto-Light',
  },
};

// Font sizes
export const FontSizes = {
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  
  // Body text
  large: 18,
  regular: 16,
  medium: 14,
  small: 12,
  tiny: 10,
  
  // Display
  display1: 48,
  display2: 36,
  display3: 28,
  
  // Specific use cases
  button: 16,
  caption: 12,
  label: 14,
  input: 16,
  tabBar: 10,
  badge: 10,
};

// Font weights
export const FontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  heavy: '800',
};

// Line heights
export const LineHeights = {
  // Relative to font size
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
  
  // Absolute values
  h1: 40,
  h2: 36,
  h3: 32,
  h4: 28,
  h5: 24,
  h6: 22,
  body: 24,
  caption: 16,
};

// Letter spacing
export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
};

// Platform-specific font configuration
import { Platform } from 'react-native';

const isIOS = Platform.OS === 'ios';

export const Fonts = {
  regular: isIOS ? FontFamilies.ios.regular : FontFamilies.android.regular,
  medium: isIOS ? FontFamilies.ios.medium : FontFamilies.android.medium,
  semiBold: isIOS ? FontFamilies.ios.semiBold : FontFamilies.android.semiBold,
  bold: isIOS ? FontFamilies.ios.bold : FontFamilies.android.bold,
  light: isIOS ? FontFamilies.ios.light : FontFamilies.android.light,
};

// Typography presets
export const Typography = {
  // Headings
  h1: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.h1,
    lineHeight: LineHeights.h1,
    fontWeight: FontWeights.bold,
  },
  h2: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.h2,
    lineHeight: LineHeights.h2,
    fontWeight: FontWeights.bold,
  },
  h3: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.h3,
    lineHeight: LineHeights.h3,
    fontWeight: FontWeights.semiBold,
  },
  h4: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.h4,
    lineHeight: LineHeights.h4,
    fontWeight: FontWeights.semiBold,
  },
  h5: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.h5,
    lineHeight: LineHeights.h5,
    fontWeight: FontWeights.medium,
  },
  h6: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.h6,
    lineHeight: LineHeights.h6,
    fontWeight: FontWeights.medium,
  },
  
  // Body
  bodyLarge: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.large,
    lineHeight: FontSizes.large * LineHeights.normal,
    fontWeight: FontWeights.regular,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.regular,
    lineHeight: FontSizes.regular * LineHeights.normal,
    fontWeight: FontWeights.regular,
  },
  bodySmall: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    lineHeight: FontSizes.small * LineHeights.normal,
    fontWeight: FontWeights.regular,
  },
  
  // Captions
  caption: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.caption,
    lineHeight: LineHeights.caption,
    fontWeight: FontWeights.regular,
  },
  captionBold: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.caption,
    lineHeight: LineHeights.caption,
    fontWeight: FontWeights.medium,
  },
  
  // Buttons
  button: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.semiBold,
    letterSpacing: LetterSpacing.wide,
  },
  buttonSmall: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium,
    fontWeight: FontWeights.medium,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Labels
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.label,
    fontWeight: FontWeights.medium,
    letterSpacing: LetterSpacing.normal,
  },
  labelSmall: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    fontWeight: FontWeights.regular,
    letterSpacing: LetterSpacing.normal,
  },
  
  // Input
  input: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.input,
    fontWeight: FontWeights.regular,
  },
  
  // Tab bar
  tabBar: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.tabBar,
    fontWeight: FontWeights.medium,
  },
  
  // Badge
  badge: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.badge,
    fontWeight: FontWeights.semiBold,
  },
  
  // Display
  display1: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.display1,
    fontWeight: FontWeights.bold,
    letterSpacing: LetterSpacing.tight,
  },
  display2: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.display2,
    fontWeight: FontWeights.bold,
    letterSpacing: LetterSpacing.tight,
  },
  
  // Amount display
  amount: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    fontWeight: FontWeights.bold,
    letterSpacing: LetterSpacing.tight,
  },
  amountSmall: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    fontWeight: FontWeights.semiBold,
  },
};

// Text transform utilities
export const TextTransform = {
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  none: { textTransform: 'none' },
};

// Text alignment utilities
export const TextAlign = {
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
  justify: { textAlign: 'justify' },
};

// Text decoration utilities
export const TextDecoration = {
  underline: { textDecorationLine: 'underline' },
  lineThrough: { textDecorationLine: 'line-through' },
  none: { textDecorationLine: 'none' },
};

export default {
  Fonts,
  FontSizes,
  FontWeights,
  LineHeights,
  LetterSpacing,
  Typography,
  TextTransform,
  TextAlign,
  TextDecoration,
};