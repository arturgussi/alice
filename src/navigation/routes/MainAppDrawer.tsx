import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';
import { signOff } from '@services/auth/Auth';

import { DrawerEquipmentRegisterStackParamList } from '../stacks/DrawerEquipmentRegisterStack';
import {
  DrawerMeasurementsStack,
  DrawerMeasurementsStackParamList,
} from '../stacks/DrawerMeasurementsStack';
import {
  DrawerMeterRegisterStack,
  DrawerMeterRegisterStackParamList,
} from '../stacks/DrawerMeterRegisterStack';

import { BottomTabNavigator, BottomTabParamList } from './BottomTabNavigator';

export type MainAppDrawerParamList = {
  HomeTabs: NavigatorScreenParams<BottomTabParamList>;
  DrawerEquipmentRegister: NavigatorScreenParams<DrawerEquipmentRegisterStackParamList>;
  DrawerMeterRegister: NavigatorScreenParams<DrawerMeterRegisterStackParamList>;
  DrawerMeasurements: NavigatorScreenParams<DrawerMeasurementsStackParamList>;
};

const Drawer = createDrawerNavigator<MainAppDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = async () => {
    signOff();
  };

  return (
    <View style={drawerStyles.container}>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label="Início"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="home"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={() =>
            props.navigation.navigate('HomeTabs', { screen: 'Inicio' })
          }
        />
        <DrawerItem
          label="Medições"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="line-chart"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={() => props.navigation.navigate('DrawerMeasurements')}
        />
        <DrawerItem
          label="Equipamento"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="shower"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={() => props.navigation.navigate('DrawerEquipmentRegister')}
        />
        <DrawerItem
          label="Dispositivo"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="tablet"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={() =>
            props.navigation.navigate('HomeTabs', {
              screen: 'Inicio',
              params: { screen: 'MeterRegister' },
            })
          }
        />
        <DrawerItem
          label="Perfil"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="user"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={() =>
            props.navigation.navigate('HomeTabs', { screen: 'Perfil' })
          }
        />
      </DrawerContentScrollView>
      {/* Footer */}
      <View>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size }) => (
            <FontAwesomeIcon
              name="sign-out"
              size={size}
              color={ThemedColors.text}
            />
          )}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemedColors.background,
  },
  // drawerHeaderContainer: {
  //   paddingHorizontal: 20,
  //   paddingVertical: 20,
  //   backgroundColor: '#003366',
  //   alignItems: 'flex-start',
  // },
});

export function MainAppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        header: navProps => <CustomHeader navigation={navProps.navigation} />,
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DrawerMeterRegister"
        component={DrawerMeterRegisterStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="DrawerMeasurements"
        component={DrawerMeasurementsStack}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
