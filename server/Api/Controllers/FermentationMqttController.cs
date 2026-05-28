using System.Text.Json;
using Mqtt.Controllers;
using Api.Entities;
using Api.Services;
using StateleSSE.AspNetCore;

namespace Api.Controllers;

public class FermentationMqttController : MqttController
{
    private readonly ILogger<FermentationMqttController> _logger;
    private readonly TelemetryService _telemetryService;
    private readonly ISseBackplane _backplane;

    public FermentationMqttController(
        ILogger<FermentationMqttController> logger,
        TelemetryService telemetryService,
        ISseBackplane backplane)
    {
        _logger = logger;
        _telemetryService = telemetryService;
        _backplane = backplane;
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

            await _backplane.Clients.SendToGroupAsync("telemetry", telemetry);

            _logger.LogInformation(
                "Telemetry saved and broadcasted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Failed to save telemetry to DB");
        }
    }
}