import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  getFocusedRouteNameFromRoute,
  NavigationState,
  PartialState,
} from '@react-navigation/native';
import { Platform, StyleSheet, View } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { ThemedColors } from '@/constants/Theme.style';
import {
  AppBottomTabParamList,
  MainAppDrawerParamList,
} from '@/types/navigation/NavigationTypes';
import { signOff } from '@services/auth/Auth';

import { BottomTabNavigator } from './BottomTabNavigator';

const Drawer = createDrawerNavigator<MainAppDrawerParamList>();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const handleLogout = async () => {
    await signOff();
  };

  const drawerState = props.state;
  const activeDrawerRoute = drawerState.routes[drawerState.index];

  let activeTabName: keyof AppBottomTabParamList | undefined;
  let activeScreenInTab: string | undefined;

  if (
    activeDrawerRoute.name === 'AppTabsContainer' &&
    activeDrawerRoute.state
  ) {
    const tabNavigatorState = activeDrawerRoute.state as
      | NavigationState<AppBottomTabParamList>
      | PartialState<NavigationState<AppBottomTabParamList>>;

    if (
      typeof tabNavigatorState.index === 'number' &&
      tabNavigatorState.routes[tabNavigatorState.index]
    ) {
      activeTabName = tabNavigatorState.routes[tabNavigatorState.index]
        .name as keyof AppBottomTabParamList;

      const activeTabRoute = tabNavigatorState.routes[tabNavigatorState.index];
      activeScreenInTab = getFocusedRouteNameFromRoute(activeTabRoute);

      if (activeTabName === 'HomeTab' && !activeScreenInTab)
        activeScreenInTab = 'HomeMain';
      if (activeTabName === 'MeasurementsTab' && !activeScreenInTab)
        activeScreenInTab = 'MeasurementsList';
      if (activeTabName === 'ProfileTab' && !activeScreenInTab)
        activeScreenInTab = 'UserProfileView';
    }
  }

  return (
    <View style={drawerStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <DrawerItem
          label="Início"
          labelStyle={{
            color:
              activeTabName === 'HomeTab' && activeScreenInTab === 'HomeMain'
                ? 'white'
                : ThemedColors.text,
          }}
          focused={
            activeTabName === 'HomeTab' && activeScreenInTab === 'HomeMain'
          }
          icon={({ focused, size }) => (
            <FontAwesomeIcon
              name="home"
              size={size}
              color={focused ? ThemedColors.lightPurple : ThemedColors.text}
            />
          )}
          activeBackgroundColor={ThemedColors.darkPurple}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: { screen: 'HomeMain' },
            })
          }
        />
        <DrawerItem
          label="Medições"
          labelStyle={{
            color:
              activeTabName === 'MeasurementsTab' &&
              (activeScreenInTab === 'MeasurementsList' ||
                activeScreenInTab === 'MeasurementDetail')
                ? 'white'
                : ThemedColors.text,
          }}
          focused={
            activeTabName === 'MeasurementsTab' &&
            (activeScreenInTab === 'MeasurementsList' ||
              activeScreenInTab === 'MeasurementDetail')
          }
          icon={({ focused, size }) => (
            <FontAwesomeIcon
              name="line-chart"
              size={size}
              color={focused ? ThemedColors.lightPurple : ThemedColors.text}
            />
          )}
          activeBackgroundColor={ThemedColors.darkPurple}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'MeasurementsTab',
              params: { screen: 'MeasurementsList' },
            })
          }
        />
        <DrawerItem
          label="Equipamentos"
          labelStyle={{
            color:
              activeTabName === 'HomeTab' &&
              activeScreenInTab === 'EquipmentManagementScreen'
                ? 'white'
                : ThemedColors.text,
          }}
          focused={
            activeTabName === 'HomeTab' &&
            activeScreenInTab === 'EquipmentManagementScreen'
          }
          icon={({ focused, size }) => (
            <FontAwesomeIcon
              name="cogs"
              size={size}
              color={focused ? ThemedColors.lightPurple : ThemedColors.text}
            />
          )}
          activeBackgroundColor={ThemedColors.darkPurple}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: {
                screen: 'EquipmentRoute',
                params: {
                  screen: 'EquipmentManagementScreen',
                },
              },
            })
          }
        />
        <DrawerItem
          label="Medidores"
          labelStyle={{
            color:
              activeTabName === 'HomeTab' &&
              activeScreenInTab === 'MeterRegisterScreen'
                ? 'white'
                : ThemedColors.text,
          }}
          focused={
            activeTabName === 'HomeTab' &&
            activeScreenInTab === 'MeterRegisterScreen'
          }
          icon={({ focused, size }) => (
            <FontAwesomeIcon
              name="tachometer"
              size={size}
              color={focused ? ThemedColors.lightPurple : ThemedColors.text}
            />
          )}
          activeBackgroundColor={ThemedColors.darkPurple}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'HomeTab',
              params: { screen: 'MeterRegisterScreen' },
            })
          }
        />
        <DrawerItem
          label="Perfil"
          labelStyle={{
            color:
              activeTabName === 'ProfileTab' &&
              activeScreenInTab === 'UserProfileView'
                ? 'white'
                : ThemedColors.text,
          }}
          focused={
            activeTabName === 'ProfileTab' &&
            activeScreenInTab === 'UserProfileView'
          }
          icon={({ focused, size }) => (
            <FontAwesomeIcon
              name="user"
              size={size}
              color={focused ? ThemedColors.lightPurple : ThemedColors.text}
            />
          )}
          activeBackgroundColor={ThemedColors.darkPurple}
          onPress={() =>
            props.navigation.navigate('AppTabsContainer', {
              screen: 'ProfileTab',
              params: { screen: 'UserProfileView' },
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
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
  },
});

export function MainAppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerStyle: {
          backgroundColor: ThemedColors.backgroundSubmenu,
        },
        drawerItemStyle: {
          marginVertical: 4,
          marginHorizontal: 8,
          borderRadius: 8,
        },
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
        drawerActiveBackgroundColor: ThemedColors.purple,
      }}
    >
      <Drawer.Screen name="AppTabsContainer" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}
