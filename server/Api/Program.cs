using Api.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;
using StateleSSE.AspNetCore;

Env.Load(Path.Combine(Directory.GetCurrentDirectory(), "..", "..", ".env"));

var builder = WebApplication.CreateBuilder(args);

// =========================
// Configuration
// =========================
builder.Configuration.AddEnvironmentVariables();

// =========================
// Database
// =========================
builder.Services.AddDbContextFactory<FermentationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres"));
});

// =========================
// SSE / Realtime
// =========================
builder.Services.AddInMemorySseBackplane();

// =========================
// Controllers
// =========================
builder.Services.AddControllers();
builder.Services.AddMqttControllers();
builder.Services.AddScoped<Api.Services.TelemetryService>();

// =========================
// Logging
// =========================
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);
builder.Logging.AddFilter("Mqtt.Controllers", LogLevel.Debug);

// =========================
// Swagger / OpenAPI
// =========================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument();

// =========================
// CORS
// =========================
builder.Services.AddCors();

var app = builder.Build();

// =========================
// Middleware
// =========================

// Connect MQTT before hosted services start
var mqttClient = app.Services.GetRequiredService<IMqttClientService>();
var config = app.Services.GetRequiredService<IConfiguration>();
var host = config["Mqtt:Host"] ?? "mqtt.flespi.io";
var port = int.TryParse(config["Mqtt:Port"], out var p) ? p : 1883;
var username = config["Mqtt:Username"]!;
var password = config["Mqtt:Password"] ?? string.Empty;

await mqttClient.ConnectAsync(host, port, username, password);

// Wait until truly connected (up to 10 seconds)
var deadline = DateTime.UtcNow.AddSeconds(10);
while (!mqttClient.IsConnected && DateTime.UtcNow < deadline)
    await Task.Delay(100);

if (!mqttClient.IsConnected)
    throw new Exception("MQTT failed to connect within 10 seconds.");

app.UseCors(c =>
    c.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
        .SetIsOriginAllowed(_ => true));

app.UseHttpsRedirection();

// =========================
// Map Controllers
// =========================
app.MapControllers();

// =========================
// SSE Endpoint
// =========================
app.MapGet("/sse", async (HttpContext context, ISseBackplane backplane) =>
{
    await context.StreamSseAsync(backplane, new[] { "telemetry" });
});

// =========================
// Run App
// =========================
app.Run();