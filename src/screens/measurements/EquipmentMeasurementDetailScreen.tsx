import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { BarChart, lineDataItem } from 'react-native-gifted-charts';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import ThemedText from '@/components/texts/ThemedText';
import { ThemedColors } from '@/constants/Theme.style';
import { useEquipmentDetail } from '@/hooks/useEquipmentDetail';
import { EquipmentMeasureStackParamList } from '@/types/navigation/NavigationTypes';
import {
  DateRangePeriod,
  formatCurrency,
  formatDate,
  formatNumber,
} from '@/Util';

// 1. Define o tipo para a prop 'navigation' específica desta tela
type EquipmentDetailListNavigationProp = NativeStackNavigationProp<
  EquipmentMeasureStackParamList,
  'EquipmentDetailScreen'
>;

// 2. Define o tipo para a prop 'route' específica desta tela
type EquipmentDetailListRouteProp = RouteProp<
  EquipmentMeasureStackParamList,
  'EquipmentDetailScreen'
>;

// 3. Define as props completas para o componente da tela
type EquipmentDetailListScreenProps = {
  navigation: EquipmentDetailListNavigationProp;
  route: EquipmentDetailListRouteProp;
};

type periodsProps = {
  key: DateRangePeriod;
  label: string;
};

// Componente para os cards de indicadores (KPIs)
const KpiCard: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.kpiCard}>
    <Text style={styles.kpiValue}>{value}</Text>
    <Text style={styles.kpiLabel}>{label}</Text>
  </View>
);

const MIN_BAR_CHART_HEIGHT_ABSOLUTE = 220; // Altura mínima absoluta para o gráfico
const PORTRAIT_CHART_HEIGHT_RATIO = 0.4; // 40% da altura da tela em retrato
const LANDSCAPE_CHART_HEIGHT_RATIO = 0.75;

export const EquipmentMeasurementDetailScreen: React.FC<
  EquipmentDetailListScreenProps
> = ({ route }) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const { equipmentId, equipmentName } = route.params;

  const {
    isLoading,
    isError,
    error,
    kpis,
    barData,
    consumoAcumulado,
    yAxisMaxValue,
    period,
    setPeriod,
    startDate,
    endDate,
    handleNavigatePeriod,
  } = useEquipmentDetail(equipmentId);

  const periods: periodsProps[] = [
    { key: 'days', label: 'Dia' },
    { key: 'weeks', label: 'Semana' },
    { key: 'months', label: 'Mês' },
    { key: 'years', label: 'Ano' },
  ];
  // --- Fim da Preparação do Gráfico ---

  const numItens = barData.length;

  const chartCardWidth = windowWidth - 30;
  // Largura do conteúdo do gráfico (descontando paddings do chartContainer)
  const chartContentWidth =
    chartCardWidth - (styles.chartContainer.paddingHorizontal || 10) * 7;

  const isLandscape = windowWidth > windowHeight;
  // Altura do gráfico adaptativa à orientação
  let barChartHeight;
  if (isLandscape) {
    // Em paisagem, windowHeight é menor. Usamos uma % maior ou um mínimo mais agressivo.
    barChartHeight = Math.max(
      windowHeight * LANDSCAPE_CHART_HEIGHT_RATIO,
      MIN_BAR_CHART_HEIGHT_ABSOLUTE,
    );
  } else {
    // Em retrato, windowHeight é maior.
    barChartHeight = windowHeight * PORTRAIT_CHART_HEIGHT_RATIO;
  }
  // Garante uma altura mínima absoluta final
  barChartHeight = Math.max(barChartHeight, MIN_BAR_CHART_HEIGHT_ABSOLUTE);
  // Subtrai um ajuste para paddings internos do BarChart e eixos, se necessário
  // Este valor pode precisar de ajuste fino. Se o gráfico parecer cortado, reduza este valor.
  const barChartInnerContentHeight = barChartHeight - 40; // Ex: 20 para padding superior, 20 para eixo X

  const fixedSpacingBetweenBars = 10;
  const initialEndSpacingTotal = numItens > 1 ? 10 : 15;
  const widthAvailableForBars =
    chartContentWidth -
    initialEndSpacingTotal * 2 -
    (numItens - 1) * fixedSpacingBetweenBars;
  const barWidthValue =
    numItens > 0 ? Math.max(10, widthAvailableForBars / numItens) : 50;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: ThemedColors.background }}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <View style={{ marginBottom: 20 }}>
        <ThemedText style={styles.pageTitle}>{equipmentName}</ThemedText>
        <ThemedText style={{ textAlign: 'center' }}>
          Análise de Consumo
        </ThemedText>
      </View>

      {/* Seletor de Período */}
      <View style={styles.filterSelectorView}>
        <View style={styles.periodSelector}>
          {periods.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.periodButton,
                period === p.key && styles.periodButtonActive,
              ]}
              onPress={() => setPeriod(p.key)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p.key && styles.periodTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={[styles.periodSelector]}>
          <View>
            <TouchableOpacity
              onPress={() => handleNavigatePeriod('previous')}
              style={styles.navButton} // Estilo para aumentar a área de toque
            >
              <FontAwesomeIcon
                name="chevron-left"
                size={18}
                color={ThemedColors.text_primary} // Cor do ícone
              />
            </TouchableOpacity>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <ThemedText>{formatDate(startDate)}</ThemedText>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <ThemedText>~</ThemedText>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <ThemedText>{formatDate(endDate)}</ThemedText>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => handleNavigatePeriod('next')}
              style={styles.navButton}
            >
              <FontAwesomeIcon
                name="chevron-right"
                size={18}
                color={ThemedColors.text_primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Exibição do Conteúdo (Loading, Erro, ou Dados) */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={ThemedColors.text}
          style={{ marginTop: 50 }}
        />
      ) : isError ? (
        <Text style={styles.errorText}>
          Erro ao carregar dados: {error?.message}
        </Text>
      ) : kpis && barData && barData.length > 0 ? ( // Se tiver dados, mostra os KPIs e o Gráfico
        <>
          {/* Cards de KPIs */}
          <View style={styles.kpiContainer}>
            <KpiCard
              label="Gasto no Período"
              value={formatCurrency(kpis.totalCost)}
            />
            <KpiCard
              label="Consumo no Período"
              value={`${formatNumber(kpis.totalConsumption, { maximumFractionDigits: 1 })} kWh`}
            />
          </View>

          {/* Gráfico */}
          <View
            style={[
              styles.chartContainer,
              {
                backgroundColor: ThemedColors.background_card,
                width: chartCardWidth,
              },
            ]}
          >
            <Text style={styles.chartTitle}>Consumo por Período (kWh)</Text>
            <BarChart
              height={barChartInnerContentHeight} // Altura explícita para o conteúdo do gráfico
              // width={chartContentWidth}
              data={barData}
              barWidth={barWidthValue}
              initialSpacing={15}
              spacing={fixedSpacingBetweenBars}
              endSpacing={numItens > 1 ? 10 : 15}
              yAxisThickness={1}
              yAxisColor={ThemedColors.placeholder}
              yAxisTextStyle={{
                color: ThemedColors.text_secondary,
                fontSize: 10,
              }}
              noOfSections={5}
              rulesType="dashed"
              rulesColor={ThemedColors.placeholder}
              rulesThickness={1}
              maxValue={yAxisMaxValue}
              xAxisThickness={1}
              xAxisColor={ThemedColors.placeholder}
              xAxisLabelTextStyle={{
                color: ThemedColors.text_primary,
                fontSize: 8,
                transform: [
                  { rotate: '-45deg' },
                  { translateX: -6 },
                  { translateY: 6 },
                ],
              }}
              showLine
              lineData={consumoAcumulado}
              lineConfig={{
                color: ThemedColors.lightPurple,
                thickness: 3,
                curved: false,
                hideDataPoints: false,
                customDataPoint: (item: lineDataItem, index: number) => {
                  const d = 8,
                    r = d / 2,
                    c = ThemedColors.lightPurple,
                    lv = item.value ? item.value.toFixed(1) : 0,
                    lc = '#FFFFFFAA',
                    lfs = 10,
                    tcW = 40;
                  return (
                    <View key={index}>
                      <View
                        style={{
                          position: 'absolute',
                          left: -r - 2,
                          top: -r - 2,
                          width: d,
                          height: d,
                          borderRadius: r,
                          backgroundColor: c,
                        }}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          left: -tcW / 2,
                          bottom: r + 20,
                          width: tcW,
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            color: lc,
                            fontSize: lfs,
                            fontWeight: 'bold',
                          }}
                        >
                          {lv}
                        </Text>
                      </View>
                    </View>
                  );
                },
              }}
              barBorderTopLeftRadius={4}
              barBorderTopRightRadius={4}
              showValuesAsTopLabel={false}
              isAnimated
              animationDuration={800}
            />
          </View>
        </>
      ) : (
        <View style={styles.messageContainer}>
          <Text
            style={{ color: ThemedColors.text_secondary, textAlign: 'center' }}
          >
            Sem dados de medição para exibir.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pageTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: ThemedColors.text,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 4,
    width: '90%',
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  periodButtonActive: {
    backgroundColor: ThemedColors.purple,
  },
  periodText: {
    color: ThemedColors.text,
    fontWeight: '500',
  },
  periodTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: ThemedColors.danger || 'red',
    textAlign: 'center',
    marginTop: 50,
  },
  kpiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '92%',
  },
  kpiCard: {
    flex: 1,
    backgroundColor: ThemedColors.background_card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    elevation: 3,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ThemedColors.text_primary,
  },
  kpiLabel: {
    fontSize: 14,
    color: ThemedColors.text_secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  chartTitle: {
    color: ThemedColors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  chartContainer: {
    minHeight: MIN_BAR_CHART_HEIGHT_ABSOLUTE + 40 + 30, // Garante que o container seja alto o suficiente para o min do gráfico + paddings/ajustes
    flexGrow: 1,
    flexShrink: 1,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    padding: 20,
  },
  legendMainContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 25,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  legendItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColorBox: { width: 14, height: 14, marginRight: 10, borderRadius: 3 },
  legendText: { fontSize: 13 },
  buttonData: {},
  navButton: {
    height: 30,
    width: 30,
    justifyContent: 'center',
  },
  filterSelectorView: {
    backgroundColor: ThemedColors.background_card,
    borderRadius: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
});
