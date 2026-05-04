#pragma once

class DisplayManager {
public:
    void init();
    void showTemperature(float temperature);
    void showMessage(const char* line1, const char* line2);
};