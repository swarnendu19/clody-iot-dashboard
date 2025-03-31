import React, { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";

const App = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Configuration
    const mqttServer = "mqtt://test.mosquitto.org";
    const mqttTopic = "sensor/data/my_test_123";

    // Connect to MQTT broker
    const client = mqtt.connect(mqttServer);

    // Handle connection
    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe(mqttTopic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${mqttTopic}`);
        } else {
          console.error("Subscription error:", err.message);
        }
      });
    });

    // Handle incoming messages
    client.on("message", (topic, message) => {
      const payload = message.toString();
      try {
        const data = JSON.parse(payload);
        setSensorData(data); // Update state with new data
      } catch (e) {
        const error = e instanceof Error ? e : new Error("Unknown error");
        console.error("Error parsing JSON:", error.message);
      }
    });

    // Handle errors
    client.on("error", (err) => {
      console.error("MQTT error:", err.message);
    });

    // Cleanup on unmount
    return () => {
      if (client) {
        client.end();
        console.log("Disconnected from MQTT broker");
      }
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Real-Time Sensor Dashboard</h1>
      {sensorData ? (
        <div>
          <p>
            <strong>Temperature:</strong> {sensorData.temperature.toFixed(1)}°C
          </p>
          <p>
            <strong>Humidity:</strong> {sensorData.humidity.toFixed(1)}%
          </p>
        </div>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
};

export default App;
