#include <Arduino.h>
#include <ArduinoJson.h>

#include "core/WifiManager.h"
#include "core/MqttManager.h"
#include "sensors/AlcoholSensor.h"
#include "sensors/TemperatureSensor.h"
#include "config/Config.h"
#include "utils/DisplayManager.h"
#include "services/TelemetryService.h"
#include "core/OtaManager.h"

DisplayManager display;
WifiManager wifi;
MqttManager mqtt;
OtaManager ota;
TelemetryService telemetry;
TemperatureSensor tempSensor(4);
AlcoholSensor alcoholSensor(34);

void logStatus(const char* line1, const char* line2) {
    Serial.print(line1);
    Serial.print(" ");
    Serial.println(line2);

    display.showMessage(line1, line2);
}

void setup() {
    Serial.begin(115200);

    Serial.println("INIT SENSOR...");
    tempSensor.init();
    Serial.println("SENSOR INIT DONE");
    
    Serial.println("INIT ALCOHOL SENSOR...");
    alcoholSensor.init();
    Serial.println("ALCOHOL SENSOR INIT DONE");

    display.init();

    logStatus("Starting...", "");
    delay(1000);

    wifi.connect();
    logStatus("WiFi", "Connected");
    delay(1000);

    ota.init([&]() {
    display.showMessage("OTA", "Updating...");
    });

    mqtt.connect();
    logStatus("MQTT", "Connected");
    delay(1000);
    

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

    if (millis() - lastTelemetry > 5000) {
        lastTelemetry = millis();

        // Read sensors
        float temp = tempSensor.read();
        float alcohol = alcoholSensor.read();

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

        // Clamp alcohol value
        if (alcohol < 0) alcohol = 0;
        if (alcohol > 1) alcohol = 1;

        // Update LCD
        display.showTemperature(temp);

        // Publish only if connections are healthy
        if (wifi.isConnected() && mqtt.isConnected()) {
            telemetry.publish(temp, alcohol);
        }
    }
}