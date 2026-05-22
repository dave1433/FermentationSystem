using Api.Controllers;
using Api.Data;
using Api.Services;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Mqtt.Controllers;

Env.Load(".env");

var builder = WebApplication.CreateBuilder(args);

// ===== Configuration =====
builder.Configuration.AddEnvironmentVariables();
// ===== DbContext =====
builder.Services.AddDbContextFactory<FermentationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Postgres")));

// ===== MQTT Controllers =====
builder.Services.AddSingleton<FermentationMqttController>();
builder.Services.AddMqttControllers();

builder.Services.AddScoped<TelemetryService>();
// ===== Controllers =====
builder.Services.AddControllers();

// ===== OpenAPI / Swagger =====
builder.Services.AddOpenApiDocument();

// ===== CORS =====
builder.Services.AddCors();

// ===== Build App =====
var app = builder.Build();

// ===== Middleware =====
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors(c =>
    c.AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin()
        .SetIsOriginAllowed(_ => true));

// ===== Controllers / Endpoints =====
app.MapControllers();

// ===== OpenAPI UI =====
app.UseOpenApi();
app.UseSwaggerUi();

// ===== MQTT Client =====
var mqtt = app.Services.GetRequiredService<IMqttClientService>();

// Flespi broker: mqtt.flespi.io:1883
// Authentication: use your flespi token as the username, leave password empty
var flespiToken = builder.Configuration["Mqtt:Username"]
                  ?? throw new InvalidOperationException("Flespi token missing. Add 'Mqtt:Username' to .env.");

await mqtt.ConnectAsync("mqtt.flespi.io", 1883, username: flespiToken, password: string.Empty);

app.Run();