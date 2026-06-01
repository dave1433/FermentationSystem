#pragma once
#include <Arduino.h>

class TelemetryService {
public:
    void publish(double temperature, double ethanolSignal, String timestamp);
private:
    bool _lastFermentationActive = false;
    float _baseline = NAN;
    float _lastNormalized = NAN;
    int _increasingCount = 0;

    bool _fermentationComplete = false;
    bool _wasEverActive = false;
    int _stableCount = 0;
};