#pragma once

#include <OneWire.h>
#include <DallasTemperature.h>

class TemperatureSensor {
public:
    TemperatureSensor(int pin);
    void init();
    float read();

private:
    OneWire oneWire;
    DallasTemperature sensors;
};