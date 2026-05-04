#pragma once

class TelemetryService {
public:
    void publish(float temperature, float alcohol = -1);
};