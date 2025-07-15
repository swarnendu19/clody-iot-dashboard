import { useState, useEffect } from "react";
import Header from "./components/Header";
import SensorCard from "./components/SensorCard";
import CombinedChart from "./components/CombinedChart";
import StatusIndicator from "./components/StatusIndicator";
import Footer from "./components/Footer";
import socket from "./socket";

const MAX_DATA_POINTS = 12; // For individual charts
const MAX_COMBINED_POINTS = 24; // For combined chart

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      intersect: false,
      mode: "index",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleColor: "#ffffff",
      bodyColor: "#ffffff",
      borderColor: "rgba(0, 255, 255, 0.2)",
      borderWidth: 1,
      padding: 10,
      cornerRadius: 5,
    },
  },
  scales: {
    x: {
      grid: { display: false, drawBorder: false },
      ticks: {
        color: "rgba(255, 255, 255, 0.6)",
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6,
      },
    },
    y: {
      grid: { color: "rgba(255, 255, 255, 0.1)", drawBorder: false },
      ticks: { color: "rgba(255, 255, 255, 0.6)" },
    },
  },
  elements: {
    point: { radius: 0, hoverRadius: 5 },
    line: { borderWidth: 2, tension: 0.4 },
  },
  interaction: { mode: "nearest", axis: "x", intersect: false },
};

const App = () => {
  const [data, setData] = useState({
    moisture: 0,
    soil_temperature: 0,
    ph: 0,
    salinity: 0,
    conductivity: 0,
  });
  const [history, setHistory] = useState([]);
  const [moistureData, setMoistureData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgba(0, 255, 255, 0.8)",
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const [tempData, setTempData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgba(245, 158, 11, 0.8)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const [phData, setPhData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgba(168, 85, 247, 0.8)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const [salinityData, setSalinityData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgba(239, 68, 68, 0.8)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const [conductivityData, setConductivityData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: "rgba(34, 197, 94, 0.8)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        borderWidth: 2,
      },
    ],
  });
  const [combinedData, setCombinedData] = useState({
    labels: [],
    datasets: [
      {
        label: "Moisture (%)",
        data: [],
        borderColor: "rgba(0, 255, 255, 0.8)",
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        fill: true,
        borderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "rgba(245, 158, 11, 0.8)",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        borderWidth: 2,
        yAxisID: "y1",
      },
      {
        label: "pH Value",
        data: [],
        borderColor: "rgba(168, 85, 247, 0.8)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        borderWidth: 2,
        yAxisID: "y2",
      },
      {
        label: "Salinity (dS/m)",
        data: [],
        borderColor: "rgba(239, 68, 68, 0.8)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        borderWidth: 2,
        yAxisID: "y3",
      },
      {
        label: "Conductivity (µS/cm)",
        data: [],
        borderColor: "rgba(34, 197, 94, 0.8)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        borderWidth: 2,
        yAxisID: "y4",
      },
    ],
  });
  const [currentValues, setCurrentValues] = useState({
    moisture: "0%",
    temperature: "0°C",
    ph: "0.0",
    salinity: "0.0 dS/m",
    conductivity: "0 µS/cm",
  });

  useEffect(() => {
    const handleSensorUpdate = (newData) => {
      // Update current data
      setData((prevData) => ({
        moisture: newData.moisture ?? prevData.moisture,
        soil_temperature: newData.soil_temperature ?? prevData.soil_temperature,
        ph: newData.ph ?? prevData.ph,
        salinity: newData.salinity ?? prevData.salinity,
        conductivity: newData.conductivity ?? prevData.conductivity,
      }));

      // Update history
      setHistory((prevHistory) => {
        const lastEntry =
          prevHistory.length > 0 ? prevHistory[prevHistory.length - 1] : data;
        const timestamp = newData.timestamp
          ? new Date(newData.timestamp * 1000)
          : new Date();
        const timeLabel =
          timestamp.getHours() +
          ":" +
          (timestamp.getMinutes() < 10 ? "0" : "") +
          timestamp.getMinutes();
        const newEntry = {
          time: timeLabel,
          moisture: newData.moisture ?? lastEntry.moisture,
          soil_temperature:
            newData.soil_temperature ?? lastEntry.soil_temperature,
          ph: newData.ph ?? lastEntry.ph,
          salinity: newData.salinity ?? lastEntry.salinity,
          conductivity: newData.conductivity ?? lastEntry.conductivity,
        };
        const nextHistory = [...prevHistory, newEntry];
        return nextHistory.length > MAX_COMBINED_POINTS
          ? nextHistory.slice(-MAX_COMBINED_POINTS)
          : nextHistory;
      });
    };

    socket.on("sensorUpdate", handleSensorUpdate);
    return () => {
      socket.off("sensorUpdate", handleSensorUpdate);
    };
  }, [data, history]);

  useEffect(() => {
    // Update chart data based on history
    const labels = history.map((entry) => entry.time);
    const moistureValues = history.map((entry) => entry.moisture);
    const tempValues = history.map((entry) => entry.soil_temperature);
    const phValues = history.map((entry) => entry.ph);
    const salinityValues = history.map((entry) => entry.salinity);
    const conductivityValues = history.map((entry) => entry.conductivity);

    // Update individual charts (limited to MAX_DATA_POINTS)
    setMoistureData({
      labels: labels.slice(-MAX_DATA_POINTS),
      datasets: [
        {
          ...moistureData.datasets[0],
          data: moistureValues.slice(-MAX_DATA_POINTS),
        },
      ],
    });
    setTempData({
      labels: labels.slice(-MAX_DATA_POINTS),
      datasets: [
        { ...tempData.datasets[0], data: tempValues.slice(-MAX_DATA_POINTS) },
      ],
    });
    setPhData({
      labels: labels.slice(-MAX_DATA_POINTS),
      datasets: [
        { ...phData.datasets[0], data: phValues.slice(-MAX_DATA_POINTS) },
      ],
    });
    setSalinityData({
      labels: labels.slice(-MAX_DATA_POINTS),
      datasets: [
        {
          ...salinityData.datasets[0],
          data: salinityValues.slice(-MAX_DATA_POINTS),
        },
      ],
    });
    setConductivityData({
      labels: labels.slice(-MAX_DATA_POINTS),
      datasets: [
        {
          ...conductivityData.datasets[0],
          data: conductivityValues.slice(-MAX_DATA_POINTS),
        },
      ],
    });

    // Update combined chart
    setCombinedData({
      labels,
      datasets: [
        { ...combinedData.datasets[0], data: moistureValues },
        { ...combinedData.datasets[1], data: tempValues },
        { ...combinedData.datasets[2], data: phValues },
        { ...combinedData.datasets[3], data: salinityValues },
        { ...combinedData.datasets[4], data: conductivityValues },
      ],
    });

    // Update current values for display
    if (history.length > 0) {
      const latest = history[history.length - 1];
      setCurrentValues({
        moisture: Math.round(latest.moisture) + "%",
        temperature: latest.soil_temperature.toFixed(1) + "°C",
        ph: latest.ph.toFixed(1),
        salinity: latest.salinity.toFixed(2) + " dS/m",
        conductivity: Math.round(latest.conductivity) + " µS/cm",
      });
    }
  }, [history]);

  const combinedChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "rgba(255, 255, 255, 0.8)",
          padding: 20,
          boxWidth: 12,
          usePointStyle: true,
        },
      },
    },
    scales: {
      x: chartOptions.scales.x,
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: 0,
        max: 100,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(0, 255, 255, 0.6)" },
        title: {
          display: true,
          text: "Moisture (%)",
          color: "rgba(0, 255, 255, 0.6)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: 15,
        max: 35,
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(245, 158, 11, 0.6)" },
        title: {
          display: true,
          text: "Temp (°C)",
          color: "rgba(245, 158, 11, 0.6)",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        min: 4.5,
        max: 8.0,
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(168, 85, 247, 0.6)" },
        title: {
          display: true,
          text: "pH Value",
          color: "rgba(168, 85, 247, 0.6)",
        },
        offset: true,
      },
      y3: {
        type: "linear",
        display: true,
        position: "right",
        min: 0.5,
        max: 5.0,
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(239, 68, 68, 0.6)" },
        title: {
          display: true,
          text: "Salinity (dS/m)",
          color: "rgba(239, 68, 68, 0.6)",
        },
        offset: true,
      },
      y4: {
        type: "linear",
        display: true,
        position: "right",
        min: 200,
        max: 2000,
        grid: { drawOnChartArea: false },
        ticks: { color: "rgba(34, 197, 94, 0.6)" },
        title: {
          display: true,
          text: "EC (µS/cm)",
          color: "rgba(34, 197, 94, 0.6)",
        },
        offset: true,
      },
    },
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header />
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <SensorCard
            title="Soil Moisture"
            subtitle="Current Level"
            value={currentValues.moisture}
            chartId="moistureChart"
            chartData={moistureData}
            chartOptions={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, min: 0, max: 100 },
              },
            }}
          />
          <SensorCard
            title="Soil Temperature"
            subtitle="Current Reading"
            value={currentValues.temperature}
            chartId="tempChart"
            chartData={tempData}
            chartOptions={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, min: 15, max: 35 },
              },
            }}
          />
          <SensorCard
            title="pH Value"
            subtitle="Current Level"
            value={currentValues.ph}
            chartId="phChart"
            chartData={phData}
            chartOptions={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, min: 4.5, max: 8.0 },
              },
            }}
          />
          <SensorCard
            title="Salinity"
            subtitle="Current Level"
            value={currentValues.salinity}
            chartId="salinityChart"
            chartData={salinityData}
            chartOptions={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, min: 0.5, max: 5.0 },
              },
            }}
          />
          <SensorCard
            title="Conductivity"
            subtitle="Current Level"
            value={currentValues.conductivity}
            chartId="conductivityChart"
            chartData={conductivityData}
            chartOptions={{
              ...chartOptions,
              scales: {
                ...chartOptions.scales,
                y: { ...chartOptions.scales.y, min: 200, max: 2000 },
              },
            }}
          />
        </div>
        <CombinedChart
          chartData={combinedData}
          chartOptions={combinedChartOptions}
        />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatusIndicator
            title="Moisture Status"
            status="Optimal"
            lottieSrc="https://assets1.lottiefiles.com/packages/lf20_gn0tojcq.json"
            color="cyan"
          />
          <StatusIndicator
            title="Temp Status"
            status="Normal"
            lottieSrc="https://assets1.lottiefiles.com/packages/lf20_2cwBXC.json"
            color="amber"
          />
          <StatusIndicator
            title="pH Status"
            status="Balanced"
            lottieSrc="https://assets1.lottiefiles.com/packages/lf20_5tkzkblw.json"
            color="purple"
          />
          <StatusIndicator
            title="Overall"
            status="Healthy"
            lottieSrc="https://assets1.lottiefiles.com/packages/lf20_osdxlbqq.json"
            color="green"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
