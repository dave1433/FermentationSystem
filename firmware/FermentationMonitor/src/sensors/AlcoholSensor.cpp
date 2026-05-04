#include "AlcoholSensor.h"
#include <Arduino.h>

AlcoholSensor::AlcoholSensor(int pin) : _pin(pin) {}

void AlcoholSensor::init() {
    pinMode(_pin, INPUT);
}

int AlcoholSensor::readRaw() {
    return analogRead(_pin);
}

float AlcoholSensor::read() {
    int raw = analogRead(_pin);

    // exponential smoothing
    _smoothed = 0.8 * _smoothed + 0.2 * raw;

    return _smoothed;
}