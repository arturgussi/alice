import React from 'react';
import {View, StyleSheet} from 'react-native';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(19, 20, 26, 1)',
    padding: 20,
  },
});

export default BackgroundWrapper;
