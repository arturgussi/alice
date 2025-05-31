// Medição
export interface Measurement {
  id: string;
  equipmentId: string;
  value: number;
  startDatetime: string;
  endDatetime: string;
  tariff: number;
}
