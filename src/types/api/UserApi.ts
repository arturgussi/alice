export interface BackendUserProfileResponse {
  id: string;
  tarifa: number;
}

export interface CreateUserApiPayload {
  idUsuario: string;
  tarifa: number;
}

export interface UpdateUserApiPayload {
  tarifa: number;
}
