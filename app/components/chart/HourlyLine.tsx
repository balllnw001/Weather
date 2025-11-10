import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface HourlyData {
  time: Date | string;
  temperature: number | null;
}

interface Props {
  hourlyData: HourlyData[];
  darkMode: boolean;
}

const HourlyLine: React.FC<Props> = ({ hourlyData, darkMode }) => {
  // แปลง time เป็น Date เสมอ
  const parsedData = hourlyData.map((d) => ({
    time: typeof d.time === "string" ? new Date(d.time) : d.time,
    temperature: d.temperature,
  }));

  const labels = parsedData.map((d) =>
    d.time.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const chartData: ChartData<"line"> = React.useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "Temperature (°C)",
          data: parsedData.map((d) => d.temperature),
          borderColor: "#f97316",
          backgroundColor: "#f97316",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: parsedData.map((d) =>
            d.temperature !== null
              ? d.temperature >= 30
                ? "#ff0000"
                : d.temperature >= 20
                ? "#f97316"
                : "#fcd34d"
              : "#4a5568"
          ),
        },
      ],
    }),
    [parsedData]
  );

  const valueLabelPlugin = React.useMemo(
    () => ({
      id: "valueLabelPlugin",
      afterDatasetsDraw: (chart: any) => {
        const { ctx, data } = chart;
        ctx.save();

        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta.hidden) return;

          meta.data.forEach((element: any, index: number) => {
            const value = dataset.data[index];
            if (value == null) return;

            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = darkMode ? "#fff" : "#000";
            ctx.strokeStyle = darkMode
              ? "rgba(0,0,0,0.6)"
              : "rgba(255,255,255,0.6)";
            ctx.lineWidth = 3;

            const x = element.x;
            const y = element.y;

            ctx.strokeText(`${value}°C`, x, y - 10);
            ctx.fillText(`${value}°C`, x, y - 10);
          });
        });

        ctx.restore();
      },
    }),
    [darkMode]
  );

  const options: ChartOptions<"line"> = React.useMemo(
    () => ({
      responsive: true,
      plugins: {
        tooltip: {
          backgroundColor: darkMode ? "#333" : "#fff",
          titleColor: darkMode ? "#fff" : "#000",
          bodyColor: darkMode ? "#fff" : "#000",
          borderColor: darkMode ? "#555" : "#ccc",
          borderWidth: 1,
        },
        legend: {
          labels: {
            color: darkMode ? "#fff" : "#000",
            usePointStyle: true,
            pointStyle: "rectRounded",
            boxWidth: 12,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: darkMode ? "#fff" : "#6b7280" },
          grid: { color: darkMode ? "#555" : "#d1d5db", borderDash: [4, 4] },
        },
        y: {
          beginAtZero: false,
          ticks: { color: darkMode ? "#fff" : "#6b7280" },
          grid: { color: darkMode ? "#555" : "#d1d5db", borderDash: [4, 4] },
        },
      },
    }),
    [darkMode]
  );

  return (
    <Chart
      type="line"
      data={chartData}
      options={options}
      plugins={[valueLabelPlugin]}
    />
  );
};

export default HourlyLine;
