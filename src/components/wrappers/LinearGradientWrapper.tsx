import React from 'react';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';

import { StyleProp, ViewStyle } from 'react-native';

interface LinearGradientWrapperProps {
    color1: string;
    color2: string;
    style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const LinearGradientWrapper: React.FC<LinearGradientWrapperProps> = ({
    color1,
    color2,
    style,
  children,
}) => {
  return (
    <LinearGradient
      colors={[color1, color2]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      style={style}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradientWrapper;
