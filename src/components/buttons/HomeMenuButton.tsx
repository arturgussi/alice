import LinearGradientWrapper from '@components/wrappers/LinearGradientWrapper';
import {ThemedColors} from '@constants/Theme.style';
import React from 'react';
import {
  StyleSheet,
  Text,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';

type HomeMenuButtonProps = {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
};

const HomeMenuButton = ({text, onPress, children}: HomeMenuButtonProps) => {
  return (
    <LinearGradientWrapper
      color1={ThemedColors.background_card}
      color2={ThemedColors.background_card2}
      style={styles.touchableOpacity}>
      <TouchableOpacity style={styles.touchableOpacity} onPress={onPress}>
        {children}
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </LinearGradientWrapper>
  );
};

const styles = StyleSheet.create({
  touchableOpacity: {
    height: 76,
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 6,
  },
  text: {
    fontSize: 9,
    marginTop: 8,
    textAlign: 'center',
    color: ThemedColors.text,
  },
});

export default HomeMenuButton;
