namespace Api.Entities
{
    public class FermentationTelemetryEntity
    {
        public Guid Id { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public bool FermentationActive { get; set; }
        public bool FermentationComplete { get; set; }
        public double Temperature { get; set; }
        public double EthanolSignal { get; set; }
        public DateTime Timestamp { get; set; }
    }
}