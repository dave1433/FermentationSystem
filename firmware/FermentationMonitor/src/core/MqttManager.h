#pragma once
#include <PubSubClient.h>
#include <WiFiClient.h>

class MqttManager {
public:
    void connect();
    void loop();
    void publish(const char* topic, const char* message);
    void publish(const char* topic, const char* message, size_t length);
private:
    WiFiClient wifiClient;
    PubSubClient client{wifiClient};

    void reconnect();
};