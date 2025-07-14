import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const SensorCard = ({
  title,
  subtitle,
  value,
  chartId,
  chartData,
  chartOptions,
}) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartOptions]);

  return (
    <div className="sensor-card rounded-xl p-6 card-gradient border border-gray-800 glow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-1">{title}</h3>
          <p className="text-cyan-200 text-sm">{subtitle}</p>
        </div>
        <div
          className={`text-4xl font-bold ${
            title.includes("Moisture")
              ? "text-cyan-400"
              : title.includes("Temperature")
              ? "text-amber-400"
              : "text-purple-400"
          }`}
        >
          {value}
        </div>
      </div>
      <div className="mt-4 h-40">
        <canvas id={chartId} ref={chartRef}></canvas>
      </div>
      <div className="mt-4 text-xs text-gray-400">
        Updated: <span className="text-cyan-200">Just now</span>
      </div>
    </div>
  );
};

export default SensorCard;
