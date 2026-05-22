#include <Arduino.h>
#include <ArduinoJson.h>

#include "core/WifiManager.h"
#include "core/MqttManager.h"
#include "sensors/AlcoholSensor.h"
#include "sensors/TemperatureSensor.h"
#include "config/Config.h"
#include "utils/DisplayManager.h"
#include "services/TelemetryService.h"
#include "core/TimeManager.h"
#include "core/OtaManager.h"

DisplayManager display;
WifiManager wifi;
MqttManager mqtt;
TimeManager timeManager;
OtaManager ota;
TelemetryService telemetry;
TemperatureSensor tempSensor(4);
AlcoholSensor alcoholSensor(34);

void logStatus(const char* line1, const char* line2) {
    display.showMessage(line1, line2);
}

void setup() {
    tempSensor.init();
    alcoholSensor.init();
    display.init();

    logStatus("Starting...", "");

    wifi.connect();
    logStatus("WiFi", "Connected");

    timeManager.init();

    ota.init([&]() {
        display.showMessage("OTA", "Updating...");
    });

    mqtt.connect();
    logStatus("MQTT", "Connected");
}

void loop() {
    ota.handle();
    mqtt.loop();

    // =========================
    // WiFi Recovery
    // =========================
    static unsigned long lastWifiRetry = 0;

    if (!wifi.isConnected() && millis() - lastWifiRetry > 5000) {
        lastWifiRetry = millis();

        logStatus("WiFi", "Reconnecting");
        wifi.connect();
    }

    // =========================
    // MQTT State Monitoring
    // =========================
    static bool lastMqttState = true;

    bool mqttConnected = mqtt.isConnected();

    if (mqttConnected != lastMqttState) {
        logStatus(
            "MQTT",
            mqttConnected ? "Connected" : "Disconnected"
        );

        lastMqttState = mqttConnected;
    }

    // =========================
    // Telemetry Loop
    // =========================
    static unsigned long lastTelemetry = 0;

    if (millis() - lastTelemetry > 300000) {
        lastTelemetry = millis();

        // Read sensors
        float temp = tempSensor.read();
        float ethanolSignal = alcoholSensor.read();

        // Validate temperature
        bool tempValid = (temp > -50 && temp < 100);

        static bool sensorErrorShown = false;

        if (!tempValid && !sensorErrorShown) {
            logStatus("TempSensor", "Error");
            sensorErrorShown = true;
        }

        if (tempValid && sensorErrorShown) {
            logStatus("TempSensor", "Recovered");
            sensorErrorShown = false;
        }
        
        // Update LCD
        display.showTemperature(temp);

        // Get ISO timestamp
        String timestamp = timeManager.getISOTime();

        // Publish only if connections are healthy
        if (wifi.isConnected() && mqtt.isConnected()) {
            telemetry.publish(temp, ethanolSignal, timestamp);
        }
    }
}