import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { IconAccount, IconAdd, IconHome } from '@assets/SVG';
import { ThemedColors } from '@constants/Theme.style';

export default function CustomMenu({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): ReactNode {
  const SvgIconsForRoutes = {
    Inicio: {
      active: IconHome,
      inactive: IconHome,
    },
    Cadastro: {
      active: IconAdd,
      inactive: IconAdd,
    },
    Perfil: {
      active: IconAccount,
      inactive: IconAccount,
    },
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: ThemedColors.backgroundSubmenu,
          height: 60,
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
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const routeNameKey = route.name as keyof typeof SvgIconsForRoutes;
        const Icons = SvgIconsForRoutes[routeNameKey];
        const IconComponent = Icons
          ? isFocused
            ? Icons.active
            : Icons.inactive
          : null;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            // testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            {IconComponent ? (
              // Se seus SVGs não aceitarem a prop 'fill' ou 'color' diretamente,
              // você pode precisar de SVGs separados para active/inactive
              // ou modificar os SVGs para aceitar 'currentColor' e passar a prop 'color'.
              // Por padrão, react-native-svg-transformer tenta permitir que props como 'fill' funcionem.
              <IconComponent />
            ) : (
              // Fallback se o ícone não for encontrado
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: 'lightgrey',
                }}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    // Sombra (opcional, ajuste conforme UX/UI)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2, // Sombra para cima
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Para Android
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8, // Espaçamento vertical interno
  },
  tabLabel: {
    fontSize: 10, // Tamanho da fonte para o label
    marginTop: 4, // Espaço entre o ícone e o label
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 4,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-around',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  labelFocused: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
