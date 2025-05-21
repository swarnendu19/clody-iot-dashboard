# Clody: Smart Sensor Data Pipeline

![image](https://github.com/user-attachments/assets/972ed88c-6267-4c77-a98e-d63a3b374478)


## Overview

**Clody** is an end-to-end IoT data pipeline for real-time and batch processing of sensor data. It connects Arduino-based sensors to a modern web dashboard using MQTT, Node.js, Redis, and a React frontend. The system is containerized using Docker for easy deployment and scalability.

---

## Architecture

The system consists of the following main components:

### 1. **Arduino Nano 33 IoT**

- **Sensors:** Soil Moisture (A0), Temperature (DS18B20, D2), and an LED (D5).
- **Function:** Reads sensor data and controls the LED.
- **Connectivity:** Connects to the local WiFi network.

### 2. **WiFi Router**

- **Role:** Provides network connectivity (192.168.0.x) for all devices.

### 3. **Mosquitto MQTT Broker**

- **Role:** Acts as a local MQTT broker to avoid public MQTT issues.
- **Port:** 1883
- **Topic:** `dip/sensor`
- **Config:** See [`mosquitto.conf`](./mosquitto.conf)

### 4. **Node.js Backend**

- **Role:** Subscribes to MQTT topics, processes incoming sensor data, and stores it in Redis.
- **Batch Processing:** Data is collected in Redis and can be processed in batches for analytics or further storage (e.g., PostgreSQL, InfluxDB).
- **Socket.IO:** Pushes real-time updates to the frontend.
- **Optional Storage:** PostgreSQL and InfluxDB integration for historical and time-series data (currently not active).
- **Config:** See [`backend/`](./backend)

### 5. **React Frontend**

- **Role:** Connects to the backend via Socket.IO to display real-time sensor data.
- **Data Format:** Receives JSON payloads for easy rendering.
- **Config:** See [`frontend/`](./frontend)

### 6. **Docker Compose**

- **Role:** Orchestrates all services (Mosquitto, Redis, PostgreSQL, InfluxDB) for local development and deployment.
- **Config:** See [`docker-compose.yml`](./docker-compose.yml)

---

## Batch Processing

- **Why Batch?**  
  Instead of processing every sensor reading individually, the backend collects data in Redis. This enables efficient batch processing for analytics, reduces database load, and allows for time-windowed aggregations.
- **How?**
  - Sensor data is published to MQTT.
  - The backend subscribes and stores each reading in Redis.
  - At configurable intervals, the backend can process batches of data (e.g., aggregate, analyze, or move to long-term storage).
  - Real-time updates are still pushed to the frontend via Socket.IO.

---

## File Structure

```
/backend         # Node.js backend (MQTT, Redis, Socket.IO, batch logic)
/frontend        # React frontend (real-time dashboard)
/publisher       # (Optional) MQTT publisher utility
docker-compose.yml
mosquitto.conf
```

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (for local development)
- Arduino Nano 33 IoT (for hardware integration)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd Clody
   ```

2. **Start all services**

   ```bash
   docker-compose up
   ```

3. **Run Backend (if not in Docker)**

   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Run Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Configuration

- **MQTT Broker:**  
  See [`mosquitto.conf`](./mosquitto.conf) for broker settings.
- **Backend:**  
  Configure environment variables in [`backend/.env`](./backend/.env).
- **Frontend:**  
  Update API endpoints in [`frontend/src/`](./frontend/src/).

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## License

MIT

---

**Diagram Reference:**  
The architecture diagram above illustrates the data flow and system components.

- **Solid lines:** Active data flow (WiFi, MQTT, Socket.IO)
- **Dashed lines:** Optional or inactive components (PostgreSQL, InfluxDB)

---

**Contact:**  
For questions, open an issue or contact the maintainer.
