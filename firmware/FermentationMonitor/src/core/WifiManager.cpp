#include <WiFi.h>
#include "WifiManager.h"
#include "config/Config.h"

void WifiManager::connect()
{
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }
}

bool WifiManager::isConnected() {
    return WiFi.status() == WL_CONNECTED;
}