import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// Seus componentes, hooks, tipos, etc.
import PrimaryButton from '@/components/buttons/ThemedButton';
import ThemedText from '@/components/texts/ThemedText';
import BackgroundWrapper from '@/components/wrappers/BackgroundWrapper';
import { ThemedColors } from '@/constants/Theme.style';
import { useDashboard } from '@/hooks/useDashboard';
import { useEquipment } from '@/hooks/useEquipment';
import { AppEquipment } from '@/types/models/EquipmentModel';
import { EquipmentMeasureStackParamList } from '@/types/navigation/NavigationTypes';
import { formatCurrency } from '@/Util';

// Tipagem para a prop de navegação desta tela
type EquipmentListNavigationProp = NativeStackNavigationProp<
  EquipmentMeasureStackParamList,
  'EquipmentList'
>;

// --- Componentes de UI Internos ---

// Componente para o Card de Resumo Mensal
const MonthlySummaryCard: React.FC<{
  totalCost: number;
  totalConsumption: number;
  change: number;
}> = ({ totalCost, change }) => {
  const changeColor = change < 0 ? ThemedColors.success : ThemedColors.danger;
  const changeIcon = change < 0 ? 'arrow-down' : 'arrow-up';
  const changeText = `${(Math.abs(change) * 100).toFixed(0)}%`;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryItem}>
        <ThemedText style={styles.summaryLabel}>
          {'Gasto Total\nno Mês'}
        </ThemedText>
        <ThemedText style={styles.summaryValue}>
          {formatCurrency(totalCost)}
        </ThemedText>
      </View>
      <View style={styles.summarySeparator} />
      <View style={styles.summaryItem}>
        <ThemedText style={styles.summaryLabel}>
          {'Comparativo\nmês anterior'}
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesomeIcon
            name={changeIcon}
            color={changeColor}
            size={14}
            style={{ marginRight: 5 }}
          />
          <ThemedText style={[styles.summaryValue, { color: changeColor }]}>
            {changeText}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

// Componente para o Card de cada Equipamento na lista
const EquipmentListItemCard: React.FC<{
  item: AppEquipment & { hasMeterAttached: boolean; monthlyCost: number };
  onPress: () => void;
}> = ({ item, onPress }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.iconContainer}>
      <FontAwesomeIcon
        name="cogs"
        size={24}
        color={ThemedColors.text_primary}
      />
    </View>
    <View style={styles.infoContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: item.hasMeterAttached
                ? ThemedColors.success
                : ThemedColors.placeholder,
            },
          ]}
        />
        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
      </View>
      <ThemedText style={styles.itemDetails}>
        {item.brand || 'Sem marca'}
      </ThemedText>
    </View>
    <View style={styles.teaserContainer}>
      <ThemedText style={styles.teaserValue}>
        {formatCurrency(item.monthlyCost || 0)}
      </ThemedText>
      <ThemedText style={styles.teaserLabel}>Gasto no Mês</ThemedText>
    </View>
    <View style={styles.chevronContainer}>
      <FontAwesomeIcon
        name="chevron-right"
        size={16}
        color={ThemedColors.text_secondary}
      />
    </View>
  </TouchableOpacity>
);

// --- Componente Principal da Tela ---

export const EquipmentMeasurementListScreen: React.FC = () => {
  const navigation = useNavigation<EquipmentListNavigationProp>();
  const {
    equipments,
    isLoadingEquipments,
    isFetchingEquipments,
    isErrorEquipments,
    errorEquipments,
    refetchEquipments,
  } = useEquipment();

  const actualDay = new Date();
  const {
    resumoGeral,
    resumoEquipamentos,
    isFetching: isFetchingDashboard,
    refetchAllDashboard,
    isError: isErrorDashboard,
    error: errorDashboard,
    statusResumoGeral,
  } = useDashboard({
    year: actualDay.getFullYear(),
    month: actualDay.getMonth() + 1,
  });

  const isLoading = isLoadingEquipments || statusResumoGeral === 'pending';
  const isFetching = isFetchingEquipments || isFetchingDashboard;
  const isError = isErrorEquipments || isErrorDashboard;
  const error = isErrorEquipments ? errorEquipments : errorDashboard;
  const combinedRefetch = () => {
    refetchEquipments();
    refetchAllDashboard();
  };
  type SortOption = 'name_asc' | 'cost_desc';
  const [sortOption, setSortOption] = useState<SortOption>('cost_desc');

  const enrichedAndSortedEquipments = useMemo(() => {
    // Para buscas rápidas, criamos um mapa dos resumos por ID
    const summaryMap = new Map(
      (resumoEquipamentos?.detalhesPorEquipamento || []).map(d => [
        d.idEquipamento,
        d,
      ]),
    );

    // Agora, enriquecemos a lista de equipamentos com os dados de resumo
    const enrichedList = (equipments || []).map(eq => {
      const summary = summaryMap.get(eq.id);
      return {
        ...eq,
        hasMeterAttached: summary ? summary.online === 1 : false,
        monthlyCost: summary ? summary.gastoMesAtual : 0,
      };
    });

    // Finalmente, ordenamos a lista enriquecida
    switch (sortOption) {
      case 'cost_desc':
        return enrichedList.sort((a, b) => b.monthlyCost - a.monthlyCost);
      case 'name_asc':
      default:
        return enrichedList.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [equipments, resumoEquipamentos, sortOption]);

  const summaryCardData = useMemo(() => {
    const gastoAtual = resumoGeral?.mesAtual?.gastoReais ?? 0;
    const gastoAnterior = resumoGeral?.mesAnterior?.gastoReais ?? 0;

    // Evita divisão por zero
    const change =
      gastoAnterior > 0 ? (gastoAtual - gastoAnterior) / gastoAnterior : 0;

    return {
      totalCost: gastoAtual,
      totalConsumption: resumoGeral?.mesAtual?.consumoKwh ?? 0,
      change: change,
    };
  }, [resumoGeral]);

  // A lógica de renderização agora usa os estados unificados
  if (isLoading) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={ThemedColors.text_primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centeredView}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar dados: {error?.message}
        </ThemedText>
        <PrimaryButton title="Tentar Novamente" onPress={combinedRefetch} />
      </View>
    );
  }

  if (isLoadingEquipments) {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={ThemedColors.text_primary} />
      </View>
    );
  }

  if (isErrorEquipments) {
    return (
      <View style={styles.centeredView}>
        <ThemedText style={styles.errorText}>
          Erro ao carregar equipamentos: {errorEquipments?.message}
        </ThemedText>
        <PrimaryButton
          title="Tentar Novamente"
          onPress={() => refetchEquipments()}
        />
      </View>
    );
  }

  return (
    <BackgroundWrapper>
      <FlatList
        data={enrichedAndSortedEquipments}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        onRefresh={combinedRefetch} // Habilita "puxar para atualizar"
        refreshing={isFetching} // Mostra o indicador de loading do refresh
        ListHeaderComponent={
          <>
            <ThemedText style={styles.pageTitle}>
              Visão Geral de Consumo
            </ThemedText>
            <MonthlySummaryCard
              totalCost={summaryCardData.totalCost}
              totalConsumption={summaryCardData.totalConsumption}
              change={summaryCardData.change}
            />
            <View style={styles.listHeaderContainer}>
              <ThemedText style={styles.listHeader}>
                Meus Equipamentos
              </ThemedText>
              <View style={styles.sortContainer}>
                <TouchableOpacity
                  onPress={() => setSortOption('cost_desc')}
                  style={[
                    styles.sortButton,
                    sortOption === 'cost_desc' && styles.sortButtonActive,
                  ]}
                >
                  <ThemedText
                    style={
                      sortOption === 'cost_desc'
                        ? styles.sortTextActive
                        : styles.sortText
                    }
                  >
                    Maior Gasto
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortOption('name_asc')}
                  style={[
                    styles.sortButton,
                    sortOption === 'name_asc' && styles.sortButtonActive,
                  ]}
                >
                  <ThemedText
                    style={
                      sortOption === 'name_asc'
                        ? styles.sortTextActive
                        : styles.sortText
                    }
                  >
                    A-Z
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EquipmentListItemCard
            item={item}
            onPress={() =>
              navigation.navigate('EquipmentDetailScreen', {
                equipmentId: item.id.toString(),
                equipmentName: item.name,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.centeredView}>
            <ThemedText style={styles.emptyText}>
              Cadastre um equipamento para ver suas medições.
            </ThemedText>
          </View>
        }
      />
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { paddingHorizontal: 6 },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: ThemedColors.text_primary,
  },
  centeredView: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: ThemedColors.danger,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    color: ThemedColors.text_secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: 16,
  },

  // Estilos do Card de Resumo
  summaryCard: {
    backgroundColor: ThemedColors.background_card,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryLabel: {
    textAlign: 'center',
    color: ThemedColors.text_secondary,
    fontSize: 13,
    marginBottom: 4,
  },
  summaryValue: {
    color: ThemedColors.text_primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  summarySeparator: {
    width: 1,
    height: '80%',
    backgroundColor: ThemedColors.border,
  },

  // Estilos da Lista e Ordenação
  listHeaderContainer: {
    paddingHorizontal: 16,
    gap: 10,
    marginTop: 24,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: ThemedColors.text_primary,
  },
  sortContainer: { flexDirection: 'row', gap: 8 },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: ThemedColors.background_card3,
  },
  sortButtonActive: { backgroundColor: ThemedColors.darkPurple },
  sortText: { color: ThemedColors.text_secondary, fontWeight: '500' },
  sortTextActive: {
    color: ThemedColors.text_primary || '#FFFFFF',
    fontWeight: 'bold',
  },

  // Estilos do Card de Item de Equipamento
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemedColors.background_card,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  iconContainer: { marginRight: 16 },
  infoContainer: { flex: 1 },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: ThemedColors.text_primary,
    marginBottom: 2,
    paddingHorizontal: 4,
  },
  itemDetails: { fontSize: 13, color: ThemedColors.text_secondary },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  teaserContainer: { alignItems: 'flex-end', marginLeft: 10 },
  teaserValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ThemedColors.text_primary,
  },
  teaserLabel: {
    fontSize: 11,
    color: ThemedColors.text_secondary,
    marginTop: 2,
  },
  chevronContainer: { marginLeft: 12 },
});

export default EquipmentMeasurementListScreen;
