import { Float } from 'react-native/Libraries/Types/CodegenTypes';

// Usuario
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  tariff: Float;
}

export interface CreateUserPayload {
  id: string; // id from Firebase
  tariff: Float;
}

export interface UpdateUserPayload {
  tariff: Float;
}

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
  tariff: Float;
}
