namespace Api.Entities
{
    public class FermentationTelemetryEntity
    {
        public Guid Id { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public bool FermentationActive { get; set; }
        public float Temperature { get; set; }
        public float EthanolSignal { get; set; }
        public DateTime Timestamp { get; set; } 
    }
}