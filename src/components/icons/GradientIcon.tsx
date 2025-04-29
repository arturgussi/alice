import React from 'react';
import {View, TextStyle, StyleProp} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

interface GradientIconProps {
  name?: string;
  size?: number;
}

const GradientIcon = (name: string, {size = 60}: GradientIconProps) => {
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
          colors={['red', 'rgba(247, 198, 80, 0.71)']}
          style={{flex: 1}}
        />
      </MaskedView>
    </View>
  );
};

export default GradientIcon;
