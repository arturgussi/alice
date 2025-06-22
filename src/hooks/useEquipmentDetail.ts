import { useQuery } from '@tanstack/react-query';
import { add, sub } from 'date-fns';
import { useMemo, useState } from 'react';

import { ThemedColors } from '@/constants/Theme.style';
import { fetchEquipmentAnalytics } from '@/services/api/EquipmentService';
import { DateRangePeriod, getDateRangeForPeriod } from '@/Util';

export const useEquipmentDetail = (equipmentId: string) => {
  // 1. Gerenciamento de estado do período e data
  const [period, setPeriod] = useState<DateRangePeriod>('weeks');
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. Cálculo do intervalo de datas
  const { startDate, endDate } = useMemo(() => {
    return getDateRangeForPeriod(period, currentDate);
  }, [period, currentDate]);

  // 3. Lógica para navegar entre os períodos
  const handleNavigatePeriod = (direction: 'previous' | 'next') => {
    const duration = { [period]: 1 };
    const newDate =
      direction === 'next'
        ? add(currentDate, duration)
        : sub(currentDate, duration);
    setCurrentDate(newDate);
  };

  // 4. Busca de dados com o useQuery CORRIGIDO
  const { data, isLoading, isError, error } = useQuery({
    // CORREÇÃO: Adicionamos startDate e endDate à queryKey
    queryKey: ['equipmentAnalytics', equipmentId, startDate, endDate],
    queryFn: () =>
      fetchEquipmentAnalytics(equipmentId, period, startDate, endDate),
    // A query só será executada se equipmentId existir
    enabled: !!equipmentId,
  });

  // 5. Preparação dos dados para o gráfico (lógica movida para cá)
  const chartPresentationData = useMemo(() => {
    // CORREÇÃO: Usamos o encadeamento opcional e o OU para tratar o caso de barData ser nulo.
    const barDataFromApi = data?.chartData?.barData || [];

    // Se não houver dados, o barDataFromApi será um array vazio, e o código abaixo
    // funcionará sem erros, retornando outros arrays vazios.
    if (!data || barDataFromApi.length === 0) {
      return {
        barData: [],
        consumoAcumulado: [],
        yAxisMaxValue: 10,
      };
    }

    // A partir daqui, temos certeza que barDataFromApi é um array com itens.
    const barData = barDataFromApi.map((item, index) => ({
      ...item,
      // label: index % 1 === 0 ? item.label : '',
      frontColor: ThemedColors.purple,
    }));

    let acumulado = 0;
    const consumoAcumulado = barData.map(item => {
      acumulado += item.value;
      return { value: acumulado, label: item.label };
    });

    const maxBarValue = Math.max(0, ...barData.map(d => d.value));
    const maxLineValue = Math.max(0, ...consumoAcumulado.map(d => d.value));
    const yAxisMaxValue = Math.ceil(Math.max(maxBarValue, maxLineValue));

    return { barData, consumoAcumulado, yAxisMaxValue };
  }, [data]);

  // 6. Retornamos tudo que o componente de UI precisa
  return {
    // Estados da query
    isLoading,
    isError,
    error,
    kpis: data?.kpis,

    // Dados preparados para o gráfico
    ...chartPresentationData,

    // Controle de período
    period,
    setPeriod,
    startDate,
    endDate,
    handleNavigatePeriod,
  };
};
