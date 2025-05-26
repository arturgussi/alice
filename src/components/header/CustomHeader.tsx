import { DrawerActions } from '@react-navigation/native';
import { ReactNode } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import images from '@assets/Images';
import GradientIcon from '@components/icons/GradientIcon';
import { ThemedColors } from '@constants/Theme.style';

interface CustomHeaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}

// Header
export function CustomHeader({ navigation }: CustomHeaderProps): ReactNode {
  return (
    <View style={stylesHeader.header}>
      <View style={stylesHeader.title}>
        <Image source={images.logo} style={stylesHeader.logo} />
        <Text style={stylesHeader.text}>ALICE</Text>
      </View>
      <TouchableOpacity
        style={stylesIcon.TouchableOpacity}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <GradientIcon name="bars" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const stylesHeader = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: ThemedColors.background,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 50,
    width: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
    color: ThemedColors.text,
    marginLeft: 10,
  },
});

const stylesIcon = StyleSheet.create({
  TouchableOpacity: {
    marginTop: 16,
    marginRight: 16,
  },
});
