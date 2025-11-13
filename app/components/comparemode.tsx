"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title,
} from "chart.js";
import { thaiCities } from "../components/api/thaiChities";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  Title
);

interface City {
  name: string;
  province: string;
  lat: number;
  lon: number;
}

const CompareMode = ({ darkMode }: { darkMode: boolean }) => {
  const [city1, setCity1] = useState<City | null>(null);
  const [city2, setCity2] = useState<City | null>(null);
  const [data1, setData1] = useState<any>(null);
  const [data2, setData2] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async (city: City) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    const json = await res.json();
    return json.daily;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!city1 && !city2) return;
      setLoading(true);
      try {
        setData1(city1 ? await fetchWeather(city1) : null);
        setData2(city2 ? await fetchWeather(city2) : null);
      } catch (err) {
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [city1, city2]);

  // ใช้ useMemo ให้ plugin อัปเดตตาม darkMode
  const valueLabelPlugin = useMemo(
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

            // สี dynamic ตาม darkMode
            ctx.fillStyle = darkMode ? "#fff" : "#000";
            ctx.strokeStyle = darkMode
              ? "rgba(0,0,0,0.6)"
              : "rgba(255,255,255,0.6)";
            ctx.lineWidth = 3;
            ctx.strokeText(value, element.x, element.y - 10);
            ctx.fillText(value, element.x, element.y - 10);
          });
        });

        ctx.restore();
      },
    }),
    [darkMode]
  );

  // chartOptions ปรับสีตาม darkMode
  const chartTemp = useMemo(() => {
    const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color + "40"); // โปร่งใส 25%
      gradient.addColorStop(1, color + "05"); // โปร่งใส 3%
      return gradient;
    };

    return {
      labels: data1?.time || data2?.time || [],
      datasets: [
        data1 && {
          label: `${city1?.name} Temp (°C)`,
          data: data1.temperature_2m_max,
          borderColor: "#ff6384",
          backgroundColor: (ctx: any) =>
            createGradient(ctx.chart.ctx, "#ff6384"),
          tension: 0.5,
          pointRadius: 7,
          pointHoverRadius: 10,
          pointBackgroundColor: "#ff6384",
          // pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
        data2 && {
          label: `${city2?.name} Temp (°C)`,
          data: data2.temperature_2m_max,
          borderColor: "#36a2eb",
          backgroundColor: (ctx: any) =>
            createGradient(ctx.chart.ctx, "#36a2eb"),
          tension: 0.5,
          pointRadius: 7,
          pointHoverRadius: 10,
          pointBackgroundColor: "#36a2eb",
          // pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
      ].filter(Boolean),
    };
  }, [data1, data2]);

  const chartRain = useMemo(() => {
    const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color + "40");
      gradient.addColorStop(1, color + "05");
      return gradient;
    };

    return {
      labels: data1?.time || data2?.time || [],
      datasets: [
        data1 && {
          label: `${city1?.name} Rain (mm)`,
          data: data1.precipitation_sum,
          borderColor: "#ff9f40",
          backgroundColor: (ctx: any) =>
            createGradient(ctx.chart.ctx, "#ff9f40"),
          tension: 0.5,
          pointRadius: 7,
          pointHoverRadius: 10,
          pointBackgroundColor: "#ff9f40",
          // pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
        data2 && {
          label: `${city2?.name} Rain (mm)`,
          data: data2.precipitation_sum,
          borderColor: "#4bc0c0",
          backgroundColor: (ctx: any) =>
            createGradient(ctx.chart.ctx, "#4bc0c0"),
          tension: 0.5,
          pointRadius: 7,
          pointHoverRadius: 10,
          pointBackgroundColor: "#4bc0c0",
          // pointBorderColor: "#fff",
          pointBorderWidth: 2,
          fill: true,
        },
      ].filter(Boolean),
    };
  }, [data1, data2]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: {
            color: darkMode ? "#fff" : "#222",
            usePointStyle: true, // ใช้จุดแทนกล่อง
            pointStyle: "rectRounded", // รูปแบบสี่เหลี่ยมมุมโค้ง
            boxWidth: 12, // ขนาดจุด/กล่อง
          },
        },

        tooltip: {
          mode: "index" as const,
          intersect: false,
          backgroundColor: darkMode ? "#333" : "#fff",
          titleColor: darkMode ? "#fff" : "#000",
          bodyColor: darkMode ? "#fff" : "#000",
          borderColor: darkMode ? "#555" : "#ccc",
          borderWidth: 1,
          padding: 10,
        },
      },
      scales: {
        x: {
          offset: true,
          ticks: { color: darkMode ? "#ddd" : "#333", font: { weight: "500" } },
          grid: { color: darkMode ? "#444" : "#eee" },
        },
        y: {
          beginAtZero: true,
          grace: "10%",
          ticks: { color: darkMode ? "#ddd" : "#333", font: { weight: "500" } },
          grid: { color: darkMode ? "#444" : "#eee" },
        },
      },
    }),
    [darkMode]
  );

  return (
    <div
      className={`flex flex-col h-full gap-6 p-6 rounded-xl transition-all duration-300 ${
        darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold">Compare Mode</h2>

      {/* Dropdown เลือกเมือง */}
      <div className="flex flex-col lg:flex-row gap-4">
        <select
          className={`p-2 rounded-md border w-full lg:w-1/2 ${
            darkMode
              ? "bg-[#2a2a2a] border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-black"
          }`}
          onChange={(e) =>
            setCity1(thaiCities.find((c) => c.name === e.target.value) || null)
          }
          value={city1?.name || ""}
        >
          <option value="">Select City 1</option>
          {thaiCities.map((c) => (
            <option
              key={c.name}
              value={c.name}
              className={darkMode ? "text-white" : "text-black"}
            >
              {c.name} ({c.province})
            </option>
          ))}
        </select>

        <select
          className={`p-2 rounded-md border w-full lg:w-1/2 ${
            darkMode
              ? "bg-[#2a2a2a] border-gray-600 text-white"
              : "bg-gray-100 border-gray-300 text-black"
          }`}
          onChange={(e) =>
            setCity2(thaiCities.find((c) => c.name === e.target.value) || null)
          }
          value={city2?.name || ""}
        >
          <option value="">Select City 2</option>
          {thaiCities.map((c) => (
            <option
              key={c.name}
              value={c.name}
              className={darkMode ? "text-white" : "text-black"}
            >
              {c.name} ({c.province})
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-400 animate-pulse">
          Loading data...
        </p>
      )}

      {/* กราฟ */}
      {data1 && data2 && !loading && (
        <div className="flex flex-col gap-6 w-full h-full overflow-hidden">
          <div
            className={`flex flex-col flex-1 p-4 rounded-lg border overflow-hidden min-w-0 w-full max-w-full ${
              darkMode
                ? "border-gray-600 bg-[#2a2a2a]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">
              🌡️ Temperature Comparison
            </h3>
            <div className="flex-1 relative w-full min-h-[280px] sm:min-h-[340px] md:min-h-[400px] overflow-hidden">
              <Line
                key={`temp-${darkMode}`} // เปลี่ยน key เมื่อ darkMode เปลี่ยน
                data={chartTemp}
                options={{ ...chartOptions, maintainAspectRatio: false }}
                plugins={[valueLabelPlugin]}
              />
            </div>
          </div>

          <div
            className={`flex flex-col flex-1 p-4 rounded-lg border overflow-hidden min-w-0 w-full max-w-full ${
              darkMode
                ? "border-gray-600 bg-[#2a2a2a]"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <h3 className="text-lg font-semibold mb-3">
              🌧️ Rainfall Comparison
            </h3>
            <div className="flex-1 relative w-full min-h-[280px] sm:min-h-[340px] md:min-h-[400px] overflow-hidden">
              <Line
                key={`rain-${darkMode}`} // เปลี่ยน key เมื่อ darkMode เปลี่ยน
                data={chartRain}
                options={{ ...chartOptions, maintainAspectRatio: false }}
                plugins={[valueLabelPlugin]}
              />
            </div>
          </div>
        </div>
      )}

      {!loading && (!city1 || !city2) && (
        <p className="text-gray-400 text-center py-6 italic">
          🏙️ กรุณาเลือกเมืองทั้งสองเมืองเพื่อเปรียบเทียบข้อมูลอากาศ
        </p>
      )}
    </div>
  );
};

export default CompareMode;
