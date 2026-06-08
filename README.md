# 🍷 FermentWatch: Intelligent Fermentation Monitoring System

FermentWatch is a full-stack IoT solution designed to monitor fermentation processes in real-time. It tracks vessel temperature and ethanol concentration, providing brewers with live insights and automated "Ready to Drink" notifications via a cyberpunk-themed dashboard.

## 🚀 Overview

The system consists of an ESP32-based firmware that gathers sensor data, a .NET 10 backend that processes and stores telemetry, and a React-based web dashboard that provides real-time visualizations using Server-Sent Events (SSE).

### Key Features
- **Real-time Telemetry:** Live temperature and ethanol signal tracking.
- **Fermentation Detection:** Automated logic to detect active fermentation and completion using trend analysis and stability windows.
- **Cyberpunk Dashboard:** A high-contrast, industrial UI with real-time charts and live logs.
- **Cloud Ready:** Containerized with Docker and ready for deployment on Fly.io.
- **OTA Updates:** Support for Over-the-Air firmware updates.

---

## 🏗️ System Architecture

1.  **Firmware (ESP32):** Reads DS18B20 temperature sensors and an alcohol sensor. It processes signals locally and publishes JSON payloads via MQTT.
2.  **MQTT Broker:** Acts as the communication bridge between hardware and the cloud.
3.  **Backend API (.NET 10):** Subscribes to MQTT topics, persists data to PostgreSQL, and broadcasts updates via SSE.
4.  **Web Client (React):** Consumes the SSE stream to update the dashboard instantly without polling.

---

## 💻 Tech Stack

### Firmware
- **Platform:** ESP32 (DFRobot FireBeetle 2)
- **Framework:** Arduino (PlatformIO)
- **Communication:** MQTT (PubSubClient), WiFi
- **Sensors:** OneWire (DS18B20), Analog Alcohol Sensor

### Backend
- **Framework:** .NET 10.0 (ASP.NET Core)
- **Database:** PostgreSQL (Entity Framework Core)
- **Real-time:** StateleSSE (SSE Backplane)
- **Broker Integration:** Mqtt.Controllers

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Vanilla CSS (Custom Cyberpunk Theme)
- **Animations:** motion/react (Framer Motion)
- **Charts:** Recharts

---

## 🛠️ Getting Started

### Prerequisites
- **Docker & Docker Compose**
- **.NET 10 SDK**
- **Node.js 20+**
- **PlatformIO** (for firmware development)

### Quick Start (Local Development)

1.  **Clone the repository**
2.  **Setup Environment Variables:**
    Create a `.env` file in the root with your MQTT and Database credentials.
    ```env
    Mqtt__Host=your-broker.com
    Mqtt__Username=your-user
    Mqtt__Password=your-password
    ConnectionStrings__Postgres=Host=localhost;Database=fermentwatch;Username=postgres;Password=password
    ```
3.  **Run the Backend:**
    ```bash
    cd server/Api
    dotnet run
    ```
4.  **Run the Frontend:**
    ```bash
    cd client/web
    npm install
    npm run dev
    ```

---

## 📦 Deployment

The project is configured for deployment on **Fly.io**.

- **Backend:** `fly deploy` from the root or `server/Api`.
- **Database:** Uses Fly Postgres.
- **Frontend:** Can be served via Nginx (see `Dockerfile` in `client/web`).

---

## 📝 License

This project is developed as part of an IoT Examination.

---

*Developed by David Chuchuca*
