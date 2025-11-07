/**
 * Spacing configuration for Nanro Bank Mobile App
 */

// Base spacing unit (8px)
const BASE_SPACING = 8;

// Spacing scale
export const Spacing = {
  // Base values
  none: 0,
  xxs: BASE_SPACING * 0.25,  // 2px
  xs: BASE_SPACING * 0.5,     // 4px
  sm: BASE_SPACING,           // 8px
  md: BASE_SPACING * 1.5,     // 12px
  lg: BASE_SPACING * 2,       // 16px
  xl: BASE_SPACING * 3,       // 24px
  xxl: BASE_SPACING * 4,      // 32px
  xxxl: BASE_SPACING * 5,     // 40px
  
  // Specific values
  base: BASE_SPACING,         // 8px
  tiny: 2,
  small: 4,
  regular: 8,
  medium: 12,
  large: 16,
  extraLarge: 24,
  huge: 32,
  massive: 48,
  
  // Component-specific
  buttonPadding: 15,
  inputPadding: 15,
  cardPadding: 20,
  screenPadding: 20,
  sectionSpacing: 24,
  listItemPadding: 16,
  iconMargin: 8,
  
  // Layout
  headerHeight: 56,
  tabBarHeight: 60,
  statusBarHeight: 44,
  bottomNavHeight: 80,
};

// Margin utilities
export const Margins = {
  // Vertical margins
  marginTop: (value) => ({ marginTop: value }),
  marginBottom: (value) => ({ marginBottom: value }),
  marginVertical: (value) => ({ marginVertical: value }),
  
  // Horizontal margins
  marginLeft: (value) => ({ marginLeft: value }),
  marginRight: (value) => ({ marginRight: value }),
  marginHorizontal: (value) => ({ marginHorizontal: value }),
  
  // All sides
  margin: (value) => ({ margin: value }),
  
  // Presets
  none: { margin: 0 },
  xs: { margin: Spacing.xs },
  sm: { margin: Spacing.sm },
  md: { margin: Spacing.md },
  lg: { margin: Spacing.lg },
  xl: { margin: Spacing.xl },
};

// Padding utilities
export const Paddings = {
  // Vertical padding
  paddingTop: (value) => ({ paddingTop: value }),
  paddingBottom: (value) => ({ paddingBottom: value }),
  paddingVertical: (value) => ({ paddingVertical: value }),
  
  // Horizontal padding
  paddingLeft: (value) => ({ paddingLeft: value }),
  paddingRight: (value) => ({ paddingRight: value }),
  paddingHorizontal: (value) => ({ paddingHorizontal: value }),
  
  // All sides
  padding: (value) => ({ padding: value }),
  
  // Presets
  none: { padding: 0 },
  xs: { padding: Spacing.xs },
  sm: { padding: Spacing.sm },
  md: { padding: Spacing.md },
  lg: { padding: Spacing.lg },
  xl: { padding: Spacing.xl },
};

// Border radius
export const BorderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  xxxl: 32,
  
  // Specific
  button: 8,
  input: 8,
  card: 12,
  modal: 16,
  sheet: 24,
  
  // Full rounded
  circle: 999,
  pill: 999,
};

// Border widths
export const BorderWidth = {
  none: 0,
  hairline: 0.5,
  thin: 1,
  regular: 1.5,
  medium: 2,
  thick: 3,
  heavy: 4,
};

// Elevation (Android shadow)
export const Elevation = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  xxl: 24,
};

// Shadow presets (iOS)
export const Shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  xxl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
};

// Layout utilities
export const Layout = {
  // Flex
  flex: (value = 1) => ({ flex: value }),
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  flexWrap: { flexWrap: 'wrap' },
  flexNoWrap: { flexWrap: 'nowrap' },
  
  // Justify content
  justifyStart: { justifyContent: 'flex-start' },
  justifyCenter: { justifyContent: 'center' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  
  // Align items
  alignStart: { alignItems: 'flex-start' },
  alignCenter: { alignItems: 'center' },
  alignEnd: { alignItems: 'flex-end' },
  alignStretch: { alignItems: 'stretch' },
  alignBaseline: { alignItems: 'baseline' },
  
  // Align self
  alignSelfStart: { alignSelf: 'flex-start' },
  alignSelfCenter: { alignSelf: 'center' },
  alignSelfEnd: { alignSelf: 'flex-end' },
  alignSelfStretch: { alignSelf: 'stretch' },
  
  // Common layouts
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  
  // Position
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Fill parent
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Width & Height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  fullSize: {
    width: '100%',
    height: '100%',
  },
};

// Dimension utilities
export const Dimensions = {
  // Width percentages
  width10: { width: '10%' },
  width20: { width: '20%' },
  width25: { width: '25%' },
  width30: { width: '30%' },
  width33: { width: '33.333%' },
  width40: { width: '40%' },
  width50: { width: '50%' },
  width60: { width: '60%' },
  width66: { width: '66.666%' },
  width70: { width: '70%' },
  width75: { width: '75%' },
  width80: { width: '80%' },
  width90: { width: '90%' },
  width100: { width: '100%' },
  
  // Height percentages
  height10: { height: '10%' },
  height20: { height: '20%' },
  height25: { height: '25%' },
  height30: { height: '30%' },
  height33: { height: '33.333%' },
  height40: { height: '40%' },
  height50: { height: '50%' },
  height60: { height: '60%' },
  height66: { height: '66.666%' },
  height70: { height: '70%' },
  height75: { height: '75%' },
  height80: { height: '80%' },
  height90: { height: '90%' },
  height100: { height: '100%' },
  
  // Fixed dimensions
  square: (size) => ({ width: size, height: size }),
  circle: (size) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
  }),
};

// Z-index layers
export const ZIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  toast: 80,
  loading: 90,
  maximum: 999,
};

// Responsive utilities
import { Dimensions as RNDimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = RNDimensions.get('window');

export const Screen = {
  width: screenWidth,
  height: screenHeight,
  isSmall: screenWidth < 375,
  isMedium: screenWidth >= 375 && screenWidth < 414,
  isLarge: screenWidth >= 414,
  isTablet: screenWidth >= 768,
};

// Responsive spacing
export const ResponsiveSpacing = {
  horizontal: Screen.isSmall ? Spacing.md : Spacing.lg,
  vertical: Screen.isSmall ? Spacing.lg : Spacing.xl,
  screenPadding: Screen.isSmall ? Spacing.md : Spacing.lg,
};

// Safe area spacing
export const SafeArea = {
  top: Spacing.statusBarHeight,
  bottom: Spacing.bottomNavHeight,
  horizontal: Spacing.screenPadding,
};

// Grid system
export const Grid = {
  columns: 12,
  gutter: Spacing.md,
  
  // Column spans
  col1: { flex: 1 / 12 },
  col2: { flex: 2 / 12 },
  col3: { flex: 3 / 12 },
  col4: { flex: 4 / 12 },
  col5: { flex: 5 / 12 },
  col6: { flex: 6 / 12 },
  col7: { flex: 7 / 12 },
  col8: { flex: 8 / 12 },
  col9: { flex: 9 / 12 },
  col10: { flex: 10 / 12 },
  col11: { flex: 11 / 12 },
  col12: { flex: 1 },
};

export default {
  Spacing,
  Margins,
  Paddings,
  BorderRadius,
  BorderWidth,
  Elevation,
  Shadows,
  Layout,
  Dimensions,
  ZIndex,
  Screen,
  ResponsiveSpacing,
  SafeArea,
  Grid,
};