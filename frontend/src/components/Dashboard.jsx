import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

export default function Dashboard() {
  const [readings, setReadings] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setReadings((prev) => [...prev.slice(-50), data]);
    };

    return () => ws.close();
  }, []);

  const chartData = {
    labels: readings.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperature °C",
        data: readings.map((r) => r.temp),
        borderColor: "rgb(255, 99, 132)",
      },
      {
        label: "Humidity %",
        data: readings.map((r) => r.humidity),
        borderColor: "rgb(54, 162, 235)",
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Real-time Sensor Dashboard</h1>
      <div className="chart-container">
        <Line data={chartData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
