#include <Arduino.h>
#include <ArduinoJson.h>

#include "core/WifiManager.h"
#include "core/MqttManager.h"
#include "sensors/AlcoholSensor.h"
#include "sensors/TemperatureSensor.h"
#include "config/Config.h"
#include "utils/DisplayManager.h"
#include "services/TelemetryService.h"

DisplayManager display;
WifiManager wifi;
MqttManager mqtt;
TelemetryService telemetry;
TemperatureSensor tempSensor(4);
AlcoholSensor alcoholSensor(34);

void logStatus(const char* line1, const char* line2) {
    Serial.print(line1);
    Serial.print(" ");
    Serial.println(line2);

    display.showMessage(line1, line2);
}

void setup() {
    Serial.begin(115200);

    Serial.println("INIT SENSOR...");
    tempSensor.init();
    Serial.println("SENSOR INIT DONE");
    
    Serial.println("INIT ALCOHOL SENSOR...");
    alcoholSensor.init();
    Serial.println("ALCOHOL SENSOR INIT DONE");

    display.init();

    logStatus("Starting...", "");
    delay(1000);

    wifi.connect();
    logStatus("WiFi", "Connected");
    delay(1000);

    mqtt.connect();
    logStatus("MQTT", "Connected");
    delay(1000);
    

}

void loop() {
    mqtt.loop();

    static unsigned long lastMsg = 0;

    if (millis() - lastMsg > 5000) {
        lastMsg = millis();

        float temp = tempSensor.read();
        float alcohol = alcoholSensor.read();

        bool valid = (temp > -50 && temp < 100);

        static bool lastState = false;
        if (valid != lastState) {
            logStatus("TempSensor", valid ? "OK" : "Error");
            lastState = valid;
            delay(1000);
        }
        
        display.showTemperature(temp);

        telemetry.publish(temp, alcohol);
    }
}