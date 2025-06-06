export interface BackendEquipmentResponse {
  id: string;
  idUsuario: string;
  nome: string;
  marca: string;
  modelo: string;
}
export interface CreateEquipmentApiPayload {
  idUsuario: string;
  nome: string;
  marca: string;
  modelo: string;
}

export interface UpdateEquipmentApiPayload {
  idUsuario: string;
  nome: string;
  marca: string;
  modelo: string;
}
