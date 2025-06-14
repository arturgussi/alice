// Um ponto de dado genérico para gráficos
export interface DataPoint {
  value: number;
  label: string;

  topLabelComponent?: () => Element;
}

// A estrutura de dados para o gráfico combinado
export interface ChartData {
  barData: DataPoint[];
  lineData: DataPoint[];
}

// A resposta completa da API de análise
export interface EquipmentAnalytics {
  kpis: {
    totalConsumption: number;
    totalCost: number;
    avgDailyCost: number;
    monthlyProjection: number;
  };
  chartData: ChartData;
}
