import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const CombinedChart = ({ chartData, chartOptions }) => {
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
    <div className="rounded-xl p-6 card-gradient border border-gray-800 glow mb-8">
      <h3 className="text-xl font-semibold mb-6">Soil Metrics Overview</h3>
      <div className="h-80">
        <canvas id="combinedChart" ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default CombinedChart;
