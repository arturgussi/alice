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
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeColors } from 'src/constants/Theme.style';

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
  ...rest
}: ThemedIconTextInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={ThemeColors.placeholder}
        style={[styles.textInput, style]}
        {...rest}
      />
      {iconName && (
          <Icon
            name={iconName}
            size={20}
            color={ThemeColors.placeholder}
            style={[styles.icon, iconStyle]}
            onPress={onIconPress}
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
    borderColor: ThemeColors.placeholder,
    paddingLeft: 20,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 15,
  },
});

export default ThemedIconTextInput;
