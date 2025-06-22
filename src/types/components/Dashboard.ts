export interface ResumoGeralResponse {
  mesAtual: {
    consumoKwh: number;
    gastoReais: number;
  };
  mesAnterior: {
    consumoKwh: number;
    gastoReais: number;
  };
}

export interface DetalheEquipamentoResumo {
  idEquipamento: number;
  nome: string;
  gastoMesAtual: number;
  consumoKwhMesAtual: number;
  online: 0 | 1;
}

export interface ResumoEquipamentosResponse {
  gastoTotalMesAtual: number;
  gastoTotalMesAnterior: number;
  economiaReais: number;
  economiaPercentual: number;
  detalhesPorEquipamento: DetalheEquipamentoResumo[];
}
