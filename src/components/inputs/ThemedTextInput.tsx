import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import {ThemedColors} from '@constants/Theme.style';

interface ThemedTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const ThemedTextInput = ({style, ...rest}: ThemedTextInputProps) => {
  return (
    <TextInput
      placeholderTextColor={ThemedColors.placeholder}
      style={[styles.textInput, style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 52,
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ThemedColors.placeholder,
    paddingLeft: 20,
  },
});

export default ThemedTextInput;
