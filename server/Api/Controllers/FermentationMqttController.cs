using System.Text.Json;
using Mqtt.Controllers;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Entities;

namespace Api.Controllers;

public class FermentationMqttController : MqttController
{
    private readonly ILogger<FermentationMqttController> _logger;
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;

    public FermentationMqttController(
        ILogger<FermentationMqttController> logger,
        IDbContextFactory<FermentationDbContext> ctxFactory)
    {
        _logger = logger;
        _ctxFactory = ctxFactory;
    }

    [MqttRoute("rdco0314/fermentation/data")]
    public async Task ListenForTelemetry(FermentationTelemetryEntity telemetry)
    {
        _logger.LogInformation("Telemetry received: {Payload}", JsonSerializer.Serialize(telemetry));

        telemetry.Id = Guid.NewGuid();
        telemetry.Timestamp = DateTime.UtcNow;

        try
        {
            using var ctx = _ctxFactory.CreateDbContext();
            ctx.Telemetries.Add(telemetry);
            await ctx.SaveChangesAsync();
            _logger.LogInformation("Telemetry saved successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save telemetry to DB");
        }
    }
}