import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface LinearGradientWrapperProps {
  color1: string;
  color2: string;
  direction?: 'vertical' | 'horizontal';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const LinearGradientWrapper: React.FC<LinearGradientWrapperProps> = ({
  color1,
  color2,
  direction = 'vertical',
  style,
  children,
}) => {
  const start =
    direction === 'horizontal' ? { x: 0, y: 0.5 } : { x: 0.5, y: 0 };
  const end = direction === 'horizontal' ? { x: 1, y: 0.5 } : { x: 0.5, y: 1 };
  return (
    <LinearGradient
      colors={[color1, color2]}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

export default LinearGradientWrapper;
