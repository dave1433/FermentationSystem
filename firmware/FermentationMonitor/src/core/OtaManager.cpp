#include "OtaManager.h"
#include <ArduinoOTA.h>

void OtaManager::init(std::function<void()> onStartCallback) {
    ArduinoOTA.setHostname("fermentation-esp32");

    ArduinoOTA.onStart([onStartCallback]() {
        Serial.println("OTA Start");

        if (onStartCallback) {
            onStartCallback();
        }
    });

    ArduinoOTA.onEnd([]() {
        Serial.println("\nOTA End");
    });

    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
        Serial.printf("Progress: %u%%\r", (progress * 100) / total);
    });

    ArduinoOTA.onError([](ota_error_t error) {
        Serial.printf("Error[%u]: ", error);
    });

    ArduinoOTA.begin();
}

void OtaManager::handle() {
    ArduinoOTA.handle();
}