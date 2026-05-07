#pragma once
#include <functional>

class OtaManager {
public:
    void init(std::function<void()> onStartCallback = nullptr);
    void handle();
};