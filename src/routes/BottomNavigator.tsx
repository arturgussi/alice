import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import EquipmentRegisterScreen from '@screens/register/equipment/EquipmentRegisterScreen';

import {ThemedColors} from '@constants/Theme.style';
import {IconAccount, IconAdd, IconHome} from '@assets/SVG';
import {View} from 'react-native';
import PlaceRegisterScreen from '@screens/register/place/PlaceRegisterScreen';
import HomeScreen from '@screens/home/HomeScreen';

const Tab = createBottomTabNavigator();

export function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarLabelStyle: {fontSize: 12},
        tabBarActiveTintColor: ThemedColors.darkPurple,
        tabBarInactiveTintColor: ThemedColors.placeholder,
        tabBarStyle: {
          backgroundColor: ThemedColors.backgroundSubmenu,
          paddingTop: 10,
          height: 60,
          borderTopWidth: 0,
        },
        tabBarIconStyle: {
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({size, color}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <IconHome size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={PlaceRegisterScreen}
        options={{
          tabBarIcon: ({size, color}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <IconAdd size={size} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={EquipmentRegisterScreen}
        options={{
          tabBarIcon: ({size, color}) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <IconAccount size={size} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
