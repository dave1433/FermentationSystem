#pragma once

class AlcoholSensor {
public:
    AlcoholSensor(int pin);

    void init();
    float read();      // smoothed value
    int readRaw();     // raw ADC

private:
    int _pin;
    float _smoothed = 0;
};