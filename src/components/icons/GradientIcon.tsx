import MaskedView from '@react-native-masked-view/masked-view';
import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { IconProps } from 'react-native-vector-icons/Icon';

import { ThemedColors } from '@constants/Theme.style';

interface GradientIconProps extends IconProps {
  name: string;
  size?: number;
}

const GradientIcon = ({ name, size }: GradientIconProps) => {
  return (
    <View style={[styles.container, { width: size }]}>
      <MaskedView
        style={[styles.maskedViewContainer, { height: size }]}
        maskElement={
          <View style={styles.maskedViewElement}>
            <FontAwesomeIcon name={name} size={size} color="white" />
          </View>
        }
      >
        <LinearGradient
          colors={[ThemedColors.darkPurple_icon, ThemedColors.lightPurple_icon]}
          style={styles.linearGradient}
        />
      </MaskedView>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  maskedViewContainer: {
    flex: 1,
    flexDirection: 'row' as const, // Por causa da estilização da Masked View
  },
  maskedViewElement: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center' as const, // Por causa da estilização da Masked View
    alignItems: 'center' as const, // Por causa da estilização da Masked View
  },
  linearGradient: {
    flex: 1,
  },
};

export default GradientIcon;
