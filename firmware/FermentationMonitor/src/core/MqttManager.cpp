#include "MqttManager.h"
#include "config/Config.h"

void MqttManager::connect() {
    client.setServer(MQTT_BROKER, MQTT_PORT);
    reconnect();
}

void MqttManager::reconnect() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");

#if MQTT_USE_AUTH
        if (client.connect(MQTT_CLIENT_ID, MQTT_USERNAME, MQTT_PASSWORD))
#else
        if (client.connect(MQTT_CLIENT_ID))
#endif
        {
            Serial.println("MQTT connected");
        } else {
            Serial.print("MQTT failed, rc=");
            Serial.println(client.state());
            delay(2000);
        }
    }
}

bool MqttManager::isConnected() {
    return client.connected();
}

void MqttManager::loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
}

void MqttManager::publish(const char* topic, const char* message) {
    if (client.publish(topic, message)) {
        Serial.println("MQTT sent");
    } else {
        Serial.println("MQTT publish failed");
    }
}

void MqttManager::publish(const char* topic, const char* message, size_t length) {
    if (client.publish(topic, message, length)) {
        Serial.println("MQTT sent");
    } else {
        Serial.println("MQTT publish failed");
    }
}