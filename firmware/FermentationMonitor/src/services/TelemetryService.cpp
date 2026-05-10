#include "TelemetryService.h"
#include <ArduinoJson.h>
#include "core/MqttManager.h"
#include "config/Config.h"

extern MqttManager mqtt;

void TelemetryService::publish(float temperature, float ethanolSignal, String timestamp) {
    StaticJsonDocument<200> doc;

    doc["temperature"] = temperature;
    doc["deviceId"] = "fermentation-monitor-1";
    doc["timestamp"] = timestamp;

    float normalized = ethanolSignal / 4095.0;
    normalized = round(normalized * 1000) / 1000.0; // Round to 3 decimal places

    bool fermentationActive = normalized > 0.05;
   
    if (ethanolSignal >= 0) {
        doc["ethanolSignal"] = normalized; 
        doc["fermentationActive"] = fermentationActive;
    }

    char buffer[200];
    size_t n = serializeJson(doc, buffer);

    mqtt.publish(MQTT_TOPIC, buffer, n);
}