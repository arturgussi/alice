import { RouteProp } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native'; // Para tela placeholder

import { CustomHeader } from '@components/header/CustomHeader';
import { ThemedColors } from '@constants/Theme.style';

// Tela Placeholder para Lista de Medições (crie o arquivo real em @screens/measure/MeasurementsListScreen.tsx)
const MeasurementsListScreen = ({
  navigation,
}: {
  navigation: DrawerMeasurementsNavigationProps<'ViewMeasurementsList'>;
}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Lista de Medições</Text>
    <Button
      title="Ver Detalhes Medição X"
      onPress={() =>
        navigation.navigate('ViewMeasurementDetail', { measurementId: 'X' })
      }
    />
  </View>
);

// Tela Placeholder para Detalhes da Medição (crie o arquivo real em @screens/measure/MeasurementDetailScreen.tsx)
const MeasurementDetailScreen = ({
  route,
}: {
  route: DrawerMeasurementsRouteProps<'ViewMeasurementDetail'>;
}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Detalhes da Medição: {route.params.measurementId}</Text>
  </View>
);

export type DrawerMeasurementsStackParamList = {
  ViewMeasurementsList: undefined;
  ViewMeasurementDetail: { measurementId: string };
};

export type DrawerMeasurementsNavigationProps<
  T extends keyof DrawerMeasurementsStackParamList,
> = NativeStackNavigationProp<DrawerMeasurementsStackParamList, T>;
export type DrawerMeasurementsRouteProps<
  T extends keyof DrawerMeasurementsStackParamList,
> = RouteProp<DrawerMeasurementsStackParamList, T>;

const Stack = createNativeStackNavigator<DrawerMeasurementsStackParamList>();

export function DrawerMeasurementsStack() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        header: () => <CustomHeader navigation={navigation} />,
        contentStyle: {
          backgroundColor: ThemedColors.background,
        },
      })}
    >
      <Stack.Screen
        name="ViewMeasurementsList"
        component={MeasurementsListScreen}
        options={{ title: 'Minhas Medições' }}
      />
      <Stack.Screen
        name="ViewMeasurementDetail"
        component={MeasurementDetailScreen}
        options={{ title: 'Detalhe da Medição' }}
      />
    </Stack.Navigator>
  );
}
