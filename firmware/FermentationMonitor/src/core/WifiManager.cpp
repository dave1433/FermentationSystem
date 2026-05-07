#include <WiFi.h>
#include "WifiManager.h"
#include "config/Config.h"

void WifiManager::connect()
{
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.println("Connecting to WiFi...");
    }
    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("Connected to WiFi");
    }

    Serial.println(WiFi.localIP());
}