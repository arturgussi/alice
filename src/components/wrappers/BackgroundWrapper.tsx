import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {ThemedColors} from '@constants/Theme.style';
import images from '@assets/Images';
import GradientIcon from '@components/icons/GradientIcon';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.title}>
          <View style={styles.logoView}>
            <Image source={images.logo} style={styles.logo} />
          </View>
          <Text style={styles.text}>ALICE</Text>
        </View>
        <View style={styles.logoView}>
          <GradientIcon name="bars" size={30} />
        </View>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemedColors.background,
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    justifyContent: 'center',
  },
  logo: {
    height: 35,
    width: 35,
  },
  text: {
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: ThemedColors.text,
    marginLeft: 10,
  },
});

export default BackgroundWrapper;
