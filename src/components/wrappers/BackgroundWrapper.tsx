import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {ThemedColors} from '@constants/Theme.style';
import images from '@assets/Images';
import GradientIcon from '@components/icons/GradientIcon';
import {ScrollView} from 'react-native-gesture-handler';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: ThemedColors.background,
    padding: 26,
  },
});

export default BackgroundWrapper;
