import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IconAccount, IconGraph, IconHome } from '@/assets/SVG';
import { AppBottomTabParamList } from '@/types/navigation/NavigationTypes';
import { ThemedColors } from '@constants/Theme.style';

type SvgComponentProps = { width: number; height: number; fill: string };
type SvgIconComponent = (props: SvgComponentProps) => ReactNode;

interface IconSet {
  active: SvgIconComponent;
  inactive: SvgIconComponent;
}

const IconesPorRota: Record<string, IconSet> = {
  HomeTab: {
    active: IconHome,
    inactive: IconHome,
  },
  MeasurementsTab: {
    active: IconGraph,
    inactive: IconGraph,
  },
  ProfileTab: {
    active: IconAccount,
    inactive: IconAccount,
  },
};

const INITIAL_SCREENS_FOR_TABS: Record<keyof AppBottomTabParamList, string> = {
  HomeTab: 'HomeMain', // Tela inicial da HomeStack
  MeasurementsTab: 'MeasurementsList', // Tela inicial da MeasurementsStack
  ProfileTab: 'UserProfileView', // Tela inicial da ProfileStack
};

const ICON_SIZE = 24;
const TAB_BAR_HEIGHT = 60;

const CustomMenu: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor:
            ThemedColors.background_submenu1 ||
            ThemedColors.background_card ||
            'white',
          height: TAB_BAR_HEIGHT,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, {
              screen:
                INITIAL_SCREENS_FOR_TABS[
                  route.name as keyof AppBottomTabParamList
                ],
              params: { screen: route.params },
            });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const IconSetForRoute = IconesPorRota[route.name];
        const IconComponent = isFocused
          ? IconSetForRoute.active
          : IconSetForRoute.inactive;

        const iconColor = isFocused
          ? ThemedColors.lightPurple_icon || 'blue'
          : ThemedColors.darkPurple_icon || 'gray';

        // Estilo condicional para o fundo da aba ativa
        const tabItemBackground = isFocused
          ? { backgroundColor: ThemedColors.darkPurple }
          : {};

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tabItem, tabItemBackground]}
          >
            <IconComponent
              width={ICON_SIZE}
              height={ICON_SIZE}
              fill={iconColor}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
  },
});

export default CustomMenu;
