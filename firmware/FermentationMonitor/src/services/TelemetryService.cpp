#include "TelemetryService.h"
#include <ArduinoJson.h>
#include "core/MqttManager.h"
#include "config/Config.h"

extern MqttManager mqtt;

void TelemetryService::publish(float temperature, float alcohol) {
    StaticJsonDocument<200> doc;

    doc["temperature"] = temperature;
    doc["device"] = "FermentationMonitor";
    doc["timestamp"] = millis();

    float normalized = alcohol / 4095.0;
    normalized = round(normalized * 1000) / 1000.0; // Round to 3 decimal places

    bool alcoholDetected = normalized > 0.01;
   
    if (alcohol >= 0) {
        doc["alcohol"] = normalized; 
        doc["alcohol_detected"] = alcoholDetected;
    }

    char buffer[200];
    size_t n = serializeJson(doc, buffer);

    mqtt.publish(MQTT_TOPIC, buffer, n);
}