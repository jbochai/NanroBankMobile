import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Modal } from 'react-native';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing, BorderRadius } from '../../styles/spacing';

const Loader = ({ visible = true, text = 'Loading...', size = 'large', color }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size={size} color={color || Colors.primary} />
          {text && <Text style={styles.text}>{text}</Text>}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
});

export default Loader;