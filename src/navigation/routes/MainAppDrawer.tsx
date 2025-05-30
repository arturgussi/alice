import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Platform, StyleSheet, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { ThemedColors } from '@/constants/Theme.style';
import { MainAppDrawerParamList } from '@/types/navigation/NavigationTypes';
import { signOff } from '@services/auth/Auth';

import { BottomTabNavigator } from './BottomTabNavigator';

const Drawer = createDrawerNavigator<MainAppDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = async () => {
    await signOff();
  };

  return (
    <View style={drawerStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <DrawerItem
          label="Início"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="home" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: {
                screen: 'HomeMain',
              },
            })
          }
        />
        <DrawerItem
          label="Medições"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="line-chart" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'MeasurementsTab',
              params: {
                screen: 'MeasurementsList',
              },
            })
          }
        />
        <DrawerItem
          label="Cadastrar Equipamento"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="cogs" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: {
                screen: 'EquipmentRegisterScreen',
              },
            })
          }
        />
        <DrawerItem
          label="Cadastrar Medidor"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="tachometer" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: {
                screen: 'MeterRegisterScreen',
              },
            })
          }
        />
        <DrawerItem
          label="Perfil"
          labelStyle={{ color: ThemedColors.text }}
          icon={({ size, color }) => (
            <FontAwesomeIcon name="user" size={size} color={color} />
          )}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'ProfileTab',
              params: {
                screen: 'UserProfileView',
              },
            })
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
    backgroundColor: ThemedColors.background,
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
        headerShown: false,
        drawerActiveTintColor: ThemedColors.lightPurple,
        drawerInactiveTintColor: ThemedColors.text,
      }}
    >
      <Drawer.Screen
        name="AppTabsContainer"
        component={BottomTabNavigator}
        options={{}}
      />
    </Drawer.Navigator>
  );
}
