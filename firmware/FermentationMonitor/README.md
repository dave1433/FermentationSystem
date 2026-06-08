# 📟 FermentWatch: Firmware

This is the ESP32 firmware for the **FermentWatch** monitoring system.

## 🛠️ Hardware Requirements

- **Microcontroller:** ESP32 (Optimized for DFRobot FireBeetle 2)
- **Temperature Sensor:** DS18B20 (OneWire)
- **Alcohol Sensor:** Analog MQ-3 or similar (Connected to ADC)
- **Display:** I2C LCD (16x2 or 20x4)

## ✨ Features

- **Multi-Sensor Reading:** Precise temperature and analog ethanol signal sampling.
- **On-Device Logic:** Detects fermentation start and completion using trend analysis.
- **MQTT Connectivity:** Publishes telemetry in JSON format.
- **OTA Updates:** Secure Over-the-Air updates via WiFi.
- **Local Display:** Real-time status readout for localized monitoring.

## 🚀 Development

Built using **PlatformIO**.

### Configuration

Wifi and MQTT credentials should be configured in `src/config/Config.h` (see example).

### Deployment

1.  Connect your ESP32.
2.  Run `pio run -t upload` to flash the firmware.
3.  Monitor output via `pio device monitor`.

---

For full project documentation, see the [Root README](../../README.md).
