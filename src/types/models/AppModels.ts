// Equipamento
export interface Equipment {
  id: string;
  name: string;
  userId: string;
}

export interface CreateEquipmentPayload {
  name: string;
  userId: string;
}

export interface UpdateEquipmentPayload {
  name?: string;
}

// Medidor
export interface Meter {
  id: string;
  name: string;
  macAddress: string;
  equipmentId: string;
  userId: string;
}

export interface CreateMeterPayload {
  name: string;
  macAddress: string;
  equipmentId: string;
  userId: string;
}

// Medição
export interface Measurement {
  id: string;
  equipmentId: string;
  value: number;
  startDatetime: string;
  endDatetime: string;
  tariff: number;
}
