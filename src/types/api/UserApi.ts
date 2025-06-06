export interface BackendUserProfileResponse {
  id: string;
  tarifa: number;
  idTarifa: number;
  UF: string;
  distribuidora: string;
  bandeiraAtual: string;
}

export interface CreateUserApiPayload {
  idUsuario: string;
}

export interface UpdateUserApiPayload {
  tarifa: number;
  idTarifa: number;
}
