import { useQuery } from '@tanstack/react-query';

import {
  fetchResumoEquipamentos,
  fetchResumoGeral,
} from '@/services/api/DashboardService';
import { ResumoGeralResponse } from '@/types/components/Dashboard';

import { useAuth } from './useAuth';

interface UseDashboardParams {
  year: number;
  month: number; // 1 para Janeiro, 2 para Fevereiro, etc.
}

export const useDashboard = (params: UseDashboardParams) => {
  const { appUser } = useAuth();
  const userId = appUser?.uid;

  const mesParam = `${params.year}-${String(params.month).padStart(2, '0')}`;

  // Query para o resumo geral
  const {
    data: resumoGeral,
    isError: isErrorResumoGeral,
    error: errorResumoGeral,
    refetch: refetchResumoGeral,
    isFetching: isFetchingResumoGeral,
    status: statusResumoGeral,
  } = useQuery({
    queryKey: ['dashboard', 'resumoGeral', userId, mesParam],
    queryFn: () => fetchResumoGeral(userId, mesParam),
    enabled: !!userId,
    // A opção 'select' transforma os dados recebidos ANTES de eles serem retornados por 'data'.
    select: (apiData): ResumoGeralResponse => {
      // 1. Verifica se a API retornou um array e pega o primeiro objeto.
      const rawData = Array.isArray(apiData) ? apiData[0] : null;

      // Se não houver dados, retorna um objeto padrão para não quebrar a UI.
      if (!rawData) {
        return {
          mesAtual: { consumoKwh: 0, gastoReais: 0 },
          mesAnterior: { consumoKwh: 0, gastoReais: 0 },
        };
      }

      // 2. Transforma a estrutura "plana" para a estrutura "aninhada" que o app espera.
      return {
        mesAtual: {
          consumoKwh: rawData.consumo_mes_atual || 0,
          gastoReais: rawData.gasto_mes_atual || 0,
        },
        mesAnterior: {
          consumoKwh: rawData.consumo_mes_anterior || 0,
          gastoReais: rawData.gasto_mes_anterior || 0,
        },
      };
    },
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  // Query para o resumo por equipamento (assumindo que já está correta)
  const {
    data: resumoEquipamentos,
    isFetching: isFetchingResumoEquipamentos,
    refetch: refetchResumoEquipamentos,
    status: statusResumoEquipamentos,
  } = useQuery({
    queryKey: ['dashboard', 'resumoEquipamentos', userId, mesParam],
    queryFn: () => fetchResumoEquipamentos(userId, mesParam),
    enabled: !!userId,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });

  const refetchAllDashboard = () => {
    refetchResumoGeral();
    refetchResumoEquipamentos();
  };

  return {
    resumoGeral,
    resumoEquipamentos,
    isFetching: isFetchingResumoGeral || isFetchingResumoEquipamentos,
    isError: isErrorResumoGeral,
    error: errorResumoGeral,
    refetchAllDashboard,
    statusResumoGeral,
    statusResumoEquipamentos,
  };
};
