# ⚙️ FermentWatch: Backend API

This is the server-side component of the **FermentWatch** system. It handles MQTT telemetry ingestion, data persistence, and real-time broadcasting.

## 🚀 Features

- **MQTT Ingestion:** Listens for telemetry from ESP32 devices using `Mqtt.Controllers`.
- **Data Persistence:** Stores historical telemetry in PostgreSQL via Entity Framework Core.
- **Real-time Broadcasting:** Serves as an SSE (Server-Sent Events) hub for frontend clients.
- **Swagger/OpenAPI:** Automatic API documentation for debugging and integration.
- **Push Notifications:** Logic for WebPush notifications (found in `PushController.cs`).

## 🛠️ Tech Stack

- **Framework:** .NET 10.0
- **Database:** PostgreSQL
- **Real-time Hub:** StateleSSE
- **MQTT Library:** Mqtt.Controllers

## 🔧 Configuration

The application uses environment variables or `appsettings.json` for configuration:

- `Mqtt:Host`: MQTT broker address.
- `Mqtt:Username`: MQTT credentials.
- `Mqtt:Password`: MQTT credentials.
- `ConnectionStrings:Postgres`: Database connection string.

## 🏃 Running Locally

```bash
# Set up your environment variables or appsettings.json
dotnet run
```

---

For full project documentation, see the [Root README](../../README.md).
