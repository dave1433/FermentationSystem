#include "TelemetryService.h"
#include <ArduinoJson.h>
#include "core/MqttManager.h"
#include "config/Config.h"

extern MqttManager mqtt;

void TelemetryService::publish(double temperature, double ethanolSignal, String timestamp) {
    StaticJsonDocument<256> doc;
    doc["temperature"] = temperature;
    doc["deviceId"] = "fermentation-monitor-1";
    doc["timestamp"] = timestamp;

    double normalized = ethanolSignal / 4095.0;
    normalized = round(normalized * 1000) / 1000.0;

    // Fixed baseline
    if (isnan(_baseline)) {
        _baseline = FERMENTATION_BASELINE;
    }

    double delta = normalized - _baseline;
    double absDelta = abs(normalized - (isnan(_lastNormalized) ? normalized : _lastNormalized));

    // Trend detection
    if (!isnan(_lastNormalized) && normalized > _lastNormalized) {
        _increasingCount++;
    } else if (!isnan(_lastNormalized) && normalized <= _lastNormalized) {
        _increasingCount = 0;
    }
    _lastNormalized = normalized;

    // Debug
    Serial.printf("[DEBUG] delta=%.4f normalized=%.4f absDelta=%.4f count=%d stable=%d\n",
        delta, normalized, absDelta, _increasingCount, _stableCount);

    // Active detection (with hysteresis)
    double onThreshold  = FERMENTATION_THRESHOLD + (FERMENTATION_HYSTERESIS / 2.0);
    double offThreshold = FERMENTATION_THRESHOLD - (FERMENTATION_HYSTERESIS / 2.0);

    bool fermentationActive = false;
    if (_lastFermentationActive) {
        fermentationActive = delta > offThreshold;
    } else {
        if (delta > FERMENTATION_MIN_DELTA && _increasingCount >= FERMENTATION_TREND_COUNT) {
            fermentationActive = delta > onThreshold;
        }
    }
    _lastFermentationActive = fermentationActive;

    // Track if fermentation was ever active
    if (fermentationActive) {
        _wasEverActive = true;
        _stableCount = 0; // reset stability counter while active
    }

    // Complete detection — only after having been active
    if (_wasEverActive && !fermentationActive && !_fermentationComplete) {
        if (absDelta < FERMENTATION_STABLE_DELTA) {
            _stableCount++;
        } else {
            _stableCount = 0; // reset if reading spikesxs
        }

        if (_stableCount >= FERMENTATION_STABLE_COUNT) {
            _fermentationComplete = true;
            Serial.println("[FERMENTATION] Complete! Beverage ready.");
        }
    }

    if (ethanolSignal >= 0) {
        doc["ethanolSignal"] = normalized;
        doc["fermentationActive"] = fermentationActive;
        doc["fermentationComplete"] = _fermentationComplete;
    }

    char buffer[256];
    size_t n = serializeJson(doc, buffer);
    mqtt.publish(MQTT_TOPIC, buffer, n);
}