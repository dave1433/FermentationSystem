#pragma once
#include <PubSubClient.h>
#include <WiFiClient.h>

class MqttManager {
public:
    void connect();
    void loop();
    void publish(const char* topic, const char* message);

private:
    WiFiClient wifiClient;
    PubSubClient client{wifiClient};

    void reconnect();
};