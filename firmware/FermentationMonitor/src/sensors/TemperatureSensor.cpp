#include "TemperatureSensor.h"

TemperatureSensor::TemperatureSensor(int pin)
    : oneWire(pin), sensors(&oneWire) {}

void TemperatureSensor::init() {
    sensors.begin();
}

float TemperatureSensor::read() {
    sensors.requestTemperatures();
    delay(750);
    return sensors.getTempCByIndex(0);
}