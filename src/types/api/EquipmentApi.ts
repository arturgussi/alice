export interface CreateEquipmentApiPayload {
  idUsuario: string;
  nome: string;
  marca: string;
  modelo: string;
}

export interface UpdateEquipmentApiPayload {
  nome?: string;
  marca?: string;
  modelo?: string;
}
