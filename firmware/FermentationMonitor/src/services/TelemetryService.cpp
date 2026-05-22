#include "TelemetryService.h"
#include <ArduinoJson.h>
#include "core/MqttManager.h"
#include "config/Config.h"

extern MqttManager mqtt;

void TelemetryService::publish(double temperature, double ethanolSignal, String timestamp) {
    StaticJsonDocument<200> doc;

    doc["temperature"] = temperature;
    doc["deviceId"] = "fermentation-monitor-1";
    doc["timestamp"] = timestamp;

    double normalized = ethanolSignal / 4095.0;
    normalized = round(normalized * 1000) / 1000.0; // Round to 3 decimal places
    // Runtime baseline calibration: if baseline not set, capture the current normalized
    if (isnan(_baseline)) {
        _baseline = normalized;
    }

    // Compute delta from baseline
    double delta = normalized - _baseline;

    // Trend detection: count consecutive increasing normalized readings
    if (!isnan(_lastNormalized) && normalized > _lastNormalized) {
        _increasingCount++;
    } else if (!isnan(_lastNormalized) && normalized <= _lastNormalized) {
        _increasingCount = 0;
    }
    _lastNormalized = normalized;

    // Apply hysteresis around the configured threshold on the delta
    double onThreshold = FERMENTATION_THRESHOLD + (FERMENTATION_HYSTERESIS / 2.0);
    double offThreshold = FERMENTATION_THRESHOLD - (FERMENTATION_HYSTERESIS / 2.0);

    bool fermentationActive = false;
    if (delta > FERMENTATION_MIN_DELTA && _increasingCount >= FERMENTATION_TREND_COUNT) {
        if (_lastFermentationActive) {
            fermentationActive = delta > offThreshold;
        } else {
            fermentationActive = delta > onThreshold;
        }
    }
    _lastFermentationActive = fermentationActive;
   
    if (ethanolSignal >= 0) {
        doc["ethanolSignal"] = normalized; 
        doc["fermentationActive"] = fermentationActive;
    }

    char buffer[200];
    size_t n = serializeJson(doc, buffer);

    mqtt.publish(MQTT_TOPIC, buffer, n);
}