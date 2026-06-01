using Api.Data;
using Api.Entities;
using Microsoft.EntityFrameworkCore;
using WebPush;

namespace Api.Services;

public class TelemetryService
{
    private readonly IDbContextFactory<FermentationDbContext> _ctxFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<TelemetryService> _logger;

    public TelemetryService(
        IDbContextFactory<FermentationDbContext> ctxFactory,
        IConfiguration config,
        ILogger<TelemetryService> logger)
    {
        _ctxFactory = ctxFactory;
        _config = config;
        _logger = logger;
    }

    public async Task SaveTelemetryAsync(FermentationTelemetryEntity telemetry)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        var existing = await ctx.Telemetries
            .FirstOrDefaultAsync(t => t.DeviceId == telemetry.DeviceId);

        bool wasComplete = existing?.FermentationComplete ?? false;

        if (existing == null)
        {
            telemetry.Id = Guid.NewGuid();
            ctx.Telemetries.Add(telemetry);
        }
        else
        {
            existing.Temperature = telemetry.Temperature;
            existing.EthanolSignal = telemetry.EthanolSignal;
            existing.FermentationActive = telemetry.FermentationActive;
            existing.FermentationComplete = telemetry.FermentationComplete;
            existing.Timestamp = telemetry.Timestamp;
        }

        await ctx.SaveChangesAsync();

        // Send push notification the first time fermentation completes
        if (!wasComplete && telemetry.FermentationComplete)
        {
            await SendReadyNotificationAsync(telemetry.DeviceId);
        }
    }

    private async Task SendReadyNotificationAsync(string deviceId)
    {
        try
        {
            using var ctx = _ctxFactory.CreateDbContext();
            var subscriptions = await ctx.PushSubscriptions.ToListAsync();

            var vapidPublicKey  = _config["Vapid:PublicKey"]!;
            var vapidPrivateKey = _config["Vapid:PrivateKey"]!;
            var vapidSubject    = _config["Vapid:Subject"]!;

            var webPushClient = new WebPushClient();
            webPushClient.SetVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

            var payload = """{"title":"🍷 Ready to Drink!","body":"Fermentation complete. Your beverage is ready!"}""";

            foreach (var sub in subscriptions)
            {
                try
                {
                    var pushSubscription = new PushSubscription(sub.Endpoint, sub.P256DH, sub.Auth);
                    await webPushClient.SendNotificationAsync(pushSubscription, payload);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to send push to {Endpoint}", sub.Endpoint);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send ready notification");
        }
    }

    public async Task<List<FermentationTelemetryEntity>> GetLatestAsync(int count = 100)
    {
        using var ctx = _ctxFactory.CreateDbContext();
        return await ctx.Telemetries
            .OrderByDescending(t => t.Timestamp)
            .Take(count)
            .ToListAsync();
    }
}