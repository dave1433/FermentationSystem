#pragma once

#include <Arduino.h>

class TimeManager {
public:
    void init();
    String getISOTime();
};