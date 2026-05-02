#include <Arduino.h>

#include "core/WifiManager.h"
#include "core/MqttManager.h"
#include "config/Config.h"

WifiManager wifi;
MqttManager mqtt;

void setup() {
    Serial.begin(115200);

    wifi.connect();
    mqtt.connect();
}

void loop() {
    mqtt.loop();

    mqtt.publish(MQTT_TOPIC, "Hello from ESP32");

    delay(2000);
}