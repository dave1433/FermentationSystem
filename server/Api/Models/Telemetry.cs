public class Telemetry
{
    public string DeviceId { get; set; } = string.Empty;

    public double Temperature { get; set; }

    public DateTime Timestamp { get; set; }

    public double EthanolSignal { get; set; }

    public bool FermentationActive { get; set; }
}