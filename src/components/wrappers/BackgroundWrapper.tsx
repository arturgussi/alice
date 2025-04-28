import React from 'react';
import {View, StyleSheet} from 'react-native';
import {ThemedColors} from '@constants/Theme.style';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemedColors.background,
    padding: 32,
  },
});

export default BackgroundWrapper;
