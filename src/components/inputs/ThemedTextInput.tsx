import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import { ThemeColors } from 'src/constants/Theme.style';

interface ThemedTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const ThemedTextInput = ({style, ...rest}: ThemedTextInputProps) => {
  return (
    <TextInput
      placeholderTextColor={ThemeColors.placeholder}
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
    borderColor: ThemeColors.placeholder,
    paddingLeft: 20,
  },
});

export default ThemedTextInput;
