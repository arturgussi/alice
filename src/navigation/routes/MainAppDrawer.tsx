import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { CustomHeader } from '@/components/header/CustomHeader';
import { ThemedColors } from '@/constants/Theme.style';
import { MainAppDrawerParamList } from '@/types/navigation/NavigationTypes';
import { signOff } from '@services/auth/Auth';

import { DrawerEquipmentRegisterStack } from '../stacks/DrawerEquipmentRegisterStack';
import { DrawerMeterRegisterStack } from '../stacks/DrawerMeasurementsStack';

import { BottomTabNavigator } from './BottomTabNavigator';

const Drawer = createDrawerNavigator<MainAppDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = async () => {
    await signOff();
  };

  const focusedRoute = getFocusedRouteNameFromRoute(
    props.state.routes[props.state.index],
  );

  return (
    <View style={drawerStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0 }}
      >
        <DrawerItem
          label="Início"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="home" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppBottomTabRouteGroup', {
              screen: 'HomeTabRoute',
            })
          }
          focused={
            props.state.routes[props.state.index].name ===
              'AppBottomTabRouteGroup' && focusedRoute === 'HomeTabRoute'
          }
        />

        <DrawerItem
          label="Medições"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="line-chart" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppBottomTabRouteGroup', {
              screen: 'MeasurementsTabRoute',
            })
          }
          focused={
            props.state.routes[props.state.index].name ===
              'AppBottomTabRouteGroup' &&
            focusedRoute === 'MeasurementsTabRoute'
          }
        />

        <DrawerItem
          label="Cadastrar Equipamento"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              name="cogs"
              /* Ícone diferente? 'shower' era o anterior */
              size={size}
              color={color}
            />
          )}
          onPress={() => props.navigation.navigate('EquipmentRegisterRoute')}
          focused={
            props.state.routes[props.state.index].name ===
            'EquipmentRegisterRoute'
          }
        />

        <DrawerItem
          label="Cadastrar Medidor"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              name="tachometer"
              /* Ícone diferente? 'tablet' era o anterior */
              size={size}
              color={color}
            />
          )}
          onPress={() => props.navigation.navigate('MeterRegisterRoute')}
          focused={
            props.state.routes[props.state.index].name === 'MeterRegisterRoute'
          }
        />

        <DrawerItem
          label="Perfil"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="user" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppBottomTabRouteGroup', {
              screen: 'ProfileTabRoute',
            })
          }
          focused={
            props.state.routes[props.state.index].name ===
              'AppBottomTabRouteGroup' && focusedRoute === 'ProfileTabRoute'
          }
        />
      </DrawerContentScrollView>

      <View style={drawerStyles.footer}>
        <DrawerItem
          label="Logout"
          labelStyle={{
            color: '#FF3B30',
          }}
          icon={({ size }) => (
            <FontAwesomeIcon name="sign-out" size={size} color={'#FF3B30'} />
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
    backgroundColor: ThemedColors.backgroundSubmenu,
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
});

export function MainAppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        header: navProps => <CustomHeader navigation={navProps.navigation} />,

        drawerActiveTintColor: ThemedColors.lightPurple,
        drawerInactiveTintColor: ThemedColors.text,
        drawerActiveBackgroundColor: ThemedColors.background_card2,
      }}
    >
      <Drawer.Screen
        name="AppBottomTabRouteGroup"
        component={BottomTabNavigator}
        options={{
          title: 'Principal', // Título para o header, se mostrado para esta rota do Drawer
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="EquipmentRegisterRoute"
        component={DrawerEquipmentRegisterStack}
        options={{
          title: 'Cadastrar Equipamento',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MeterRegisterRoute"
        component={DrawerMeterRegisterStack}
        options={{
          title: 'Cadastrar Medidor',
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}
