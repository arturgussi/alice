export interface BackendMeterResponse {
  id: number;
  idUsuario: string;
  nome: string;
  macAddress: string;
  idEquipamento: number;
}

export interface CreateMeterApiPayload {
  idUsuario: string;
  nome: string;
  macAddress: string;
  idEquipamento: number | null;
}

export interface UpdateMeterApiPayload {
  name: string;
  idEquipamento: number;
}
