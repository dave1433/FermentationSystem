#pragma once
#include <Arduino.h>

class TelemetryService {
public:
    void publish(float temperature, float ethanolSignal, String timestamp);
};