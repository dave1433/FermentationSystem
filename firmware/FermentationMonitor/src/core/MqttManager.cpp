#include "MqttManager.h"
#include "config/Config.h"

void MqttManager::connect() {
    client.setServer(MQTT_BROKER, MQTT_PORT);

    reconnect();
}

void MqttManager::reconnect() {
    while (!client.connected()) {
        client.connect("ESP32Client");
        delay(500);
    }
}

void MqttManager::loop() {
    if (!client.connected()) {
        reconnect();
    }

    client.loop();
}

void MqttManager::publish(const char* topic, const char* message) {
    client.publish(topic, message);
}