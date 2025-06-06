import { useQuery } from '@tanstack/react-query';

import {
  fetchAvailableUfs,
  fetchDistributorsByUf,
} from '@/services/api/TarrifService';

/**
 * Hook para gerenciar a busca de UFs e Distribuidoras.
 * @param selectedUf A UF selecionada pelo usuário.
 */
export const useTariffs = (selectedUf: string | undefined) => {
  // Query para buscar a lista de todas as UFs disponíveis
  const {
    data: ufs,
    isLoading: isLoadingUfs,
    isError: isErrorUfs,
  } = useQuery({
    queryKey: ['ufs'], // Chave única para esta query
    queryFn: fetchAvailableUfs, // Função que busca os dados
    staleTime: Infinity, // UFs não mudam com frequência, pode manter em cache por mais tempo
  });

  // Query para buscar as distribuidoras, DEPENDENTE da UF selecionada
  const { data: distributors, isLoading: isLoadingDistributors } = useQuery({
    queryKey: ['distributors', selectedUf], // Chave inclui selectedUf para refazer a busca quando mudar
    queryFn: () => {
      // A verificação 'enabled' abaixo torna este 'if' uma segurança extra
      if (!selectedUf) return [];
      return fetchDistributorsByUf(selectedUf);
    },
    // A query só é habilitada (enabled) se uma UF for selecionada
    enabled: !!selectedUf,
  });

  return {
    ufs: ufs || [],
    isLoadingUfs,
    isErrorUfs,
    distributors: distributors || [],
    isLoadingDistributors,
  };
};
