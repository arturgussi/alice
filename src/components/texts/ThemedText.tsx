import React from 'react';
import {StyleSheet, Text, TextProps, TextStyle, StyleProp} from 'react-native';
import {ThemedColors} from '@constants/Theme.style';

interface ThemedTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

const ThemedText = ({style, ...rest}: ThemedTextProps) => {
  return <Text style={[styles.text, style]} {...rest} />;
};

const styles = StyleSheet.create({
  text: {
    fontWeight: '400',
    fontSize: 14,
    color: ThemedColors.text,
  },
});

export default ThemedText;
