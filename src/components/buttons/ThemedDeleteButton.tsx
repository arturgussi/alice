import {
  StyleSheet,
  Pressable,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

type ThemedDeleteButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

const ThemedDeleteButton = ({
  title,
  onPress,
  style,
  textStyle,
}: ThemedDeleteButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <FontAwesomeIcon name="trash" size={20} style={styles.icon} />
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(179, 0, 0, 1)',
  },
  text: {
    color: 'rgba(179, 0, 0, 1)',
    fontSize: 14,
    fontWeight: '700',
  },
  icon: {
    color: 'rgba(179, 0, 0, 1)',
    marginRight: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ThemedDeleteButton;
