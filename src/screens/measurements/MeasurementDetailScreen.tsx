import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ColorValue,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
// React e hooks não são mais necessários para o onLayout que causava loop
// import React, { useState, useCallback } from 'react';

export type BottomMeasurementRouteProps<RouteName extends string> = {
  key: string;
  name: RouteName;
  params: RouteName extends 'MeasurementDetail'
    ? { measurementId: string }
    : undefined;
  path?: string;
};

const APP_THEME = {
  background: '#161625',
  cardBackground: '#232339',
  textPrimary: '#FFFFFF',
  textSecondary: '#D0D0D0',
  accentPurple: '#A020F0',
  lineColor: '#DDA0DD',
  axisAndRules: '#606075',
  dataPointLabelColor: '#FFFFFF',
};

interface MyBarDataItem {
  value: number;
  label: string;
  frontColor: ColorValue;
  topLabelComponent?: () => JSX.Element | null;
}

const MIN_BAR_CHART_HEIGHT_ABSOLUTE = 220; // Altura mínima absoluta para o gráfico
const PORTRAIT_CHART_HEIGHT_RATIO = 0.4; // 40% da altura da tela em retrato
const LANDSCAPE_CHART_HEIGHT_RATIO = 0.75; // 75% da altura da tela (que é menor) em paisagem

export const MeasurementDetailScreen = ({
  route,
}: {
  route: BottomMeasurementRouteProps<'MeasurementDetail'>;
}) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const isLandscape = windowWidth > windowHeight;

  const dadosBaseIntervalo = [
    /* ... seus dados ... */ { value: 0.5, label: '00:05' },
    { value: 0.7, label: '00:10' },
    { value: 0.4, label: '00:15' },
    { value: 0.6, label: '00:20' },
    { value: 0.3, label: '00:25' },
    { value: 0.8, label: '00:30' },
  ];

  const consumoPorIntervalo: MyBarDataItem[] = dadosBaseIntervalo.map(
    (itemData, index) => ({
      value: itemData.value,
      label: itemData.label,
      frontColor: APP_THEME.accentPurple,
      topLabelComponent: () => {
        if (index === 0 && dadosBaseIntervalo.length > 1) {
          return <View style={{ width: 0, height: 0 }} />;
        }
        return (
          <Text
            style={{
              color: APP_THEME.textPrimary,
              fontSize: 10,
              marginBottom: 2,
            }}
          >
            {itemData.value.toFixed(1)}
          </Text>
        );
      },
    }),
  );

  const numItens = consumoPorIntervalo.length;

  let acumulado = 0;
  const consumoAcumulado = dadosBaseIntervalo.map(item => {
    acumulado += item.value;
    return { value: acumulado, label: item.label };
  });

  const maxBarValue = Math.max(0, ...dadosBaseIntervalo.map(d => d.value));
  const maxLineValue = Math.max(0, ...consumoAcumulado.map(d => d.value));
  const yAxisMaxValue =
    Math.ceil(Math.max(maxBarValue, maxLineValue) * 1.1) + 1;

  const chartCardWidth = windowWidth * 0.92;
  // Largura do conteúdo do gráfico (descontando paddings do chartContainer)
  const chartContentWidth =
    chartCardWidth - (styles.chartContainer.paddingHorizontal || 10) * 2;

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
  const initialEndSpacingTotal = 15 + (numItens > 1 ? 10 : 15);
  const widthAvailableForBars =
    chartContentWidth -
    initialEndSpacingTotal -
    (numItens - 1) * fixedSpacingBetweenBars;
  const barWidthValue =
    numItens > 0 ? Math.max(10, widthAvailableForBars / numItens) : 50;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: APP_THEME.background }}
      contentContainerStyle={styles.scrollViewContentContainer}
    >
      <Text style={[styles.title, { color: APP_THEME.textPrimary }]}>
        Detalhes da Medição: {route.params.measurementId}
      </Text>
      <Text style={[styles.chartTitle, { color: APP_THEME.textPrimary }]}>
        Consumo de Energia (kWh)
      </Text>

      <View
        style={[
          styles.chartContainer,
          { backgroundColor: APP_THEME.cardBackground, width: chartCardWidth },
        ]}
      >
        {numItens > 0 ? (
          <BarChart
            height={barChartInnerContentHeight} // Altura explícita para o conteúdo do gráfico
            width={chartContentWidth}
            data={consumoPorIntervalo}
            barWidth={barWidthValue}
            initialSpacing={15}
            spacing={fixedSpacingBetweenBars}
            endSpacing={numItens > 1 ? 10 : 15}
            yAxisThickness={1}
            yAxisColor={APP_THEME.axisAndRules}
            yAxisTextStyle={{ color: APP_THEME.textSecondary, fontSize: 10 }}
            noOfSections={5}
            rulesType="dashed"
            rulesColor={APP_THEME.axisAndRules}
            rulesThickness={1}
            maxValue={yAxisMaxValue}
            xAxisThickness={1}
            xAxisColor={APP_THEME.axisAndRules}
            xAxisLabelTextStyle={{
              color: APP_THEME.textSecondary,
              fontSize: 10,
              textAlign: 'center',
            }}
            showLine
            lineData={consumoAcumulado}
            lineConfig={{
              color: APP_THEME.lineColor,
              thickness: 3,
              curved: false,
              hideDataPoints: false,
              customDataPoint: (
                item: { value: number; label?: string },
                index: number,
              ) => {
                const d = 8,
                  r = d / 2,
                  c = APP_THEME.lineColor,
                  lv = item.value.toFixed(1),
                  lc = APP_THEME.dataPointLabelColor,
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
                        style={{ color: lc, fontSize: lfs, fontWeight: 'bold' }}
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
        ) : (
          <View style={styles.messageContainer}>
            <Text
              style={{ color: APP_THEME.textSecondary, textAlign: 'center' }}
            >
              Sem dados de medição para exibir.
            </Text>
          </View>
        )}
      </View>

      {/* Legenda Vertical */}
      <View style={styles.legendMainContainer}>
        {/* ... */}
        <View style={styles.legendItemContainer}>
          <View
            style={[
              styles.legendColorBox,
              { backgroundColor: APP_THEME.accentPurple },
            ]}
          />
          <Text style={[styles.legendText, { color: APP_THEME.textSecondary }]}>
            Consumo por Intervalo (kWh)
          </Text>
        </View>
        <View style={styles.legendItemContainer}>
          <View
            style={[
              styles.legendColorBox,
              { backgroundColor: APP_THEME.lineColor },
            ]}
          />
          <Text style={[styles.legendText, { color: APP_THEME.textSecondary }]}>
            Consumo Acumulado (kWh)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  chartContainer: {
    minHeight: MIN_BAR_CHART_HEIGHT_ABSOLUTE + 40 + 30, // Garante que o container seja alto o suficiente para o min do gráfico + paddings/ajustes
    flexGrow: 1, // Permite que o container do gráfico cresça se houver mais espaço na tela
    flexShrink: 1,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    // backgroundColor é definido inline
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Centraliza o BarChart (que tem altura e largura definidas) dentro deste container se ele for maior
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
});
