export interface BackendUserProfileResponse {
  id: string;
  tarifa: number;
}

export interface CreateUserApiPayload {
  id: string;
  tarifa: number;
}

export interface UpdateUserApiPayload {
  tarifa: number;
}
