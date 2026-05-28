export interface Telemetry {
  deviceId: string;
  fermentationActive: boolean;
  temperature: number;
  ethanolSignal: number;
  timestamp: string;
}