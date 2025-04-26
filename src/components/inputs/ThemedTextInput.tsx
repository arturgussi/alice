import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleProp,
} from 'react-native';

const placeHolderColor = 'rgba(179, 179, 179, 0.8)';

interface ThemedTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

const ThemedTextInput = ({style, ...rest}: ThemedTextInputProps) => {
  return (
    <TextInput
      placeholderTextColor={placeHolderColor}
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
    borderColor: placeHolderColor,
    paddingLeft: 20,
  },
});

export default ThemedTextInput;
