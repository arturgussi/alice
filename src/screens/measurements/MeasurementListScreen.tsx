import React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';

import {
  BottomMeasurementNavigationProps,
  BottomMeasurementRouteProps,
} from '@/navigation/stacks/BottomMeasurementStack';

type MeasurementListScreenProps = {
  navigation: BottomMeasurementNavigationProps<'MeasurementList'>;
  route: BottomMeasurementRouteProps<'MeasurementList'>;
};

export const MeasurementListScreen: React.FC<MeasurementListScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Medições</Text>
      <Button
        title="Ver Detalhes Medição X (ID: X)"
        onPress={() =>
          navigation.navigate('MeasurementDetail', { measurementId: 'idX' })
        }
      />
      <Button
        title="Ver Detalhes Medição Y (ID: Y)"
        onPress={() =>
          navigation.navigate('MeasurementDetail', { measurementId: 'idY' })
        }
      />
    </View>
  );
};

// Estilos de exemplo para a tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
});
