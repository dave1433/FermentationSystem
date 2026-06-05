export interface Telemetry {
  deviceId: string;
  fermentationActive: boolean;
  fermentationComplete: boolean;
  temperature: number;
  ethanolSignal: number;
  timestamp: string;
}