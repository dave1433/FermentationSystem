#include "OtaManager.h"
#include <ArduinoOTA.h>

void OtaManager::init(std::function<void()> onStartCallback) {
    ArduinoOTA.setHostname("fermentation-esp32");

    ArduinoOTA.onStart([onStartCallback]() {
        if (onStartCallback) {
            onStartCallback();
        }
    });

    ArduinoOTA.onEnd([]() {
    });

    ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    });

    ArduinoOTA.onError([](ota_error_t error) {
        Serial.printf("Error[%u]: ", error);
    });

    ArduinoOTA.begin();
}

void OtaManager::handle() {
    ArduinoOTA.handle();
}