import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { ThemedColors } from '@constants/Theme.style';

interface ThemedIconTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  iconName?: string;
  iconStyle?: StyleProp<ViewStyle>;
  onIconPress?: () => void;
}

const ThemedIconTextInput = ({
  style,
  placeholder,
  iconName,
  iconStyle,
  onIconPress,
  editable,
  ...rest
}: ThemedIconTextInputProps) => {
  const isEditable = editable ?? true;
  const containerOpacity = isEditable ? 1.0 : 0.5;

  return (
    <View style={[styles.container, { opacity: containerOpacity }]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={ThemedColors.placeholder}
        style={[styles.textInput, style]}
        editable={isEditable}
        {...rest}
      />
      {iconName && (
        <FontAwesomeIcon
          name={iconName}
          size={20}
          color={ThemedColors.placeholder}
          style={[styles.icon, iconStyle]}
          onPress={isEditable ? onIconPress : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  textInput: {
    height: 52,
    fontWeight: '400',
    fontSize: 14,
    color: 'white',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: ThemedColors.placeholder,
    paddingLeft: 20,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 15,
  },
});

export default ThemedIconTextInput;
