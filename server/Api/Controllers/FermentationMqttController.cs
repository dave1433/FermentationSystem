using System.Text.Json;
using Mqtt.Controllers;
using Api.Entities;
using Api.Services;

namespace Api.Controllers;

public class FermentationMqttController : MqttController
{
    private readonly ILogger<FermentationMqttController> _logger;
    private readonly TelemetryService _telemetryService;

    public FermentationMqttController(
        ILogger<FermentationMqttController> logger,
        TelemetryService telemetryService)
    {
        _logger = logger;
        _telemetryService = telemetryService;
    }

    [MqttRoute("rdco0314/fermentation/data")]
    public async Task ListenForTelemetry(
        FermentationTelemetryEntity telemetry)
    {
        _logger.LogInformation(
            "Telemetry received: {Payload}",
            JsonSerializer.Serialize(telemetry));

        try
        {
            await _telemetryService
                .SaveTelemetryAsync(telemetry);

            _logger.LogInformation(
                "Telemetry saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to save telemetry to DB");
        }
    }
}