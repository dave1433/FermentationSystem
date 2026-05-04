#include "DisplayManager.h"
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);

void DisplayManager::init() {
    lcd.init();
    lcd.backlight();
}

void DisplayManager::showTemperature(float temperature) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Temp:");

    lcd.setCursor(0, 1);
    lcd.print(temperature, 1);
}

void DisplayManager::showMessage(const char* line1, const char* line2) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(line1);

    lcd.setCursor(0, 1);
    lcd.print(line2);
}