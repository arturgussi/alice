import { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedColors } from '@constants/Theme.style';

interface BackgroundWrapperProps {
  children: ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
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
