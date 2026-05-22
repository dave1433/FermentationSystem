#include "TimeManager.h"
#include <Arduino.h>
#include <time.h>

void TimeManager::init() {
    configTime(0, 0, "pool.ntp.org");

    struct tm timeinfo;

    while(!getLocalTime(&timeinfo)) {
        Serial.println("Failed to obtain time");
        delay(1000);
    }
}

String TimeManager::getISOTime() {
    struct tm timeinfo;

    if (!getLocalTime(&timeinfo)) {
        return "unknown";
    }

    char buffer[30];

    strftime(
        buffer,
        sizeof(buffer),
        "%Y-%m-%dT%H:%M:%SZ",
        &timeinfo
    );

    return String(buffer);
}