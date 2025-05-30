import { Text, View } from 'react-native';

import { BottomMeasurementRouteProps } from '@/navigation/stacks/BottomMeasurementStack';

export const MeasurementDetailScreen = ({
  route,
}: {
  route: BottomMeasurementRouteProps<'MeasurementDetail'>;
}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Detalhes da Medição: {route.params.measurementId}</Text>
  </View>
);
