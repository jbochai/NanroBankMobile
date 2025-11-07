import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../../styles/colors';
import { Fonts } from '../../styles/fonts';
import { Spacing } from '../../styles/spacing';

const AmountKeypad = ({ onKeyPress, onDelete, onClear }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'del'],
  ];

  const handleKeyPress = (key) => {
    if (key === 'del') {
      onDelete && onDelete();
    } else {
      onKeyPress && onKeyPress(key);
    }
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity
              key={key}
              style={styles.key}
              onPress={() => handleKeyPress(key)}
              activeOpacity={0.7}>
              {key === 'del' ? (
                <Icon name="backspace" size={24} color={Colors.text} />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  key: {
    flex: 1,
    aspectRatio: 1.5,
    backgroundColor: Colors.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
  },
  keyText: {
    fontSize: 24,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
});

export default AmountKeypad;