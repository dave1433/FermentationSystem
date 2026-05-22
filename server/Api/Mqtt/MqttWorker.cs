using Mqtt.Controllers;

namespace Api.Mqtt;

public class MqttWorker : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _config;
    private readonly ILogger<MqttWorker> _logger;

    public MqttWorker(
        IServiceProvider serviceProvider,
        IConfiguration config,
        ILogger<MqttWorker> logger)
    {
        _serviceProvider = serviceProvider;
        _config = config;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(2000, stoppingToken);

        var host = _config["Mqtt:Host"] ?? "mqtt.flespi.io";
        var portStr = _config["Mqtt:Port"] ?? "1883";
        if (!int.TryParse(portStr, out var port))
        {
            port = 1883;
        }
        var username = _config["Mqtt:Username"];
        var password = _config["Mqtt:Password"] ?? string.Empty;

        if (string.IsNullOrEmpty(username))
        {
            _logger.LogError("MQTT Username is missing.");
            return;
        }

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var mqttClient = scope.ServiceProvider.GetRequiredService<IMqttClientService>();

                _logger.LogInformation("Connecting to MQTT broker...");
                await mqttClient.ConnectAsync(host, port, username, password);
                _logger.LogInformation("MQTT Connected.");

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "MQTT connection failed. Retrying...");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }
}
