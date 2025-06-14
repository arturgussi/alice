import {
  StyleSheet,
  Pressable,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type ThemedButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const ThemedButton = ({
  title,
  onPress,
  style,
  disabled,
  textStyle,
}: ThemedButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={['rgba(148, 85, 215, 1)', 'rgba(33, 23, 60, 1)']} // Gradiente de 180deg
        style={styles.gradientBackground}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  text: {
    color: 'rgba(179, 179, 179, 1)',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ThemedButton;
