import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import { ThemedColors } from '@constants/Theme.style';

interface LinearGradientWrapperProps {
  children: React.ReactNode;
}

const LinearGradientWrapper: React.FC<LinearGradientWrapperProps> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={[ThemedColors.lightPurple, ThemedColors.darkPurple]}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      {children}
    </LinearGradient>
  );
};

export default LinearGradient;
