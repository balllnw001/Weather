import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  rainTotal: number;
}

interface Props {
  data: DailyData[];
  darkMode: boolean;
}

const DailySummar: React.FC<Props> = ({ data, darkMode }) => {
  const labels = data.map((d) =>
    new Date(d.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    })
  );

  const chartData: ChartData<"bar" | "line"> = React.useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "Temp Max (°C)",
          data: data.map((d) => d.tempMax),
          borderColor: "#f97316",
          backgroundColor: "#f97316",
          yAxisID: "y",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: data.map((d) =>
            d.tempMax >= 30
              ? "#ff0000"
              : d.tempMax >= 20
              ? "#f97316"
              : "#fcd34d"
          ),
        },
        {
          type: "line" as const,
          label: "Temp Min (°C)",
          data: data.map((d) => d.tempMin),
          borderColor: "#34d399",
          backgroundColor: "#34d399",
          yAxisID: "y",
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: data.map((d) =>
            d.tempMin <= 10
              ? "#0ea5e9"
              : d.tempMin <= 20
              ? "#34d399"
              : "#a3e635"
          ),
        },
        {
          type: "bar" as const,
          label: "Rain (mm)",
          data: data.map((d) => d.rainTotal),
          backgroundColor: "#60a5fa",
          borderRadius: 5,
          yAxisID: "y",
          barThickness: 15,
          maxBarThickness: 20,
        },
      ],
    }),
    [data]
  );

  // Plugin แสดงค่าเหนือจุด/บาร์ แบบสมูท
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

            // ใช้ตำแหน่งจริงของ element
            const x = element.x;
            const y = element.y;

            ctx.strokeText(value, x, y - 10);
            ctx.fillText(value, x, y - 10);
          });
        });

        ctx.restore();
      },
    }),
    [darkMode]
  );

  const options: ChartOptions<"bar" | "line"> = React.useMemo(
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
        y: {
          beginAtZero: true,
          ticks: { color: darkMode ? "#fff" : "#6b7280" },
          grid: { color: darkMode ? "#555" : "#d1d5db", borderDash: [4, 4] },
        },
        x: {
          ticks: { color: darkMode ? "#fff" : "#6b7280" },
          grid: { color: darkMode ? "#555" : "#d1d5db", borderDash: [4, 4] },
        },
      },
    }),
    [darkMode]
  );

  return (
    <Chart
      key={darkMode ? "dark" : "light"}
      type="bar"
      data={chartData}
      options={options}
      plugins={[valueLabelPlugin]}
    />
  );
};

export default DailySummar;
