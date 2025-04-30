import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { IconProps } from 'react-native-vector-icons/Icon';
import { ThemedColors } from '@constants/Theme.style';

interface GradientIconProps extends IconProps {
  name: string;
  size?: number;
}

const GradientIcon = ({name, size}: GradientIconProps) => {
  return (
    <View style={{width: size, flex: 1}}>
      <MaskedView
        style={{flex: 1, flexDirection: 'row', height: size}}
        maskElement={
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesomeIcon name={name} size={size} color="white" />
          </View>
        }>
        <LinearGradient
          colors={[ThemedColors.darkPurple_icon, ThemedColors.lightPurple_icon]}
          style={{flex: 1}}
        />
      </MaskedView>
    </View>
  );
};

export default GradientIcon;
