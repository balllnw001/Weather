"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWeather, fetchForecast } from "../utils/fetchweather";
import HourlyLine from "../components/chart/HourlyLine";
import DailySummer from "../components/chart/DailySummer";
import { thaiCities, ThaiCity } from "../utils/thaiChities";

interface ChartPageProps {
  darkMode: boolean;
}

interface HourlyData {
  time: Date;
  temperature: number | null;
}

interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  rainTotal: number;
}

const ChartPage: React.FC<ChartPageProps> = ({ darkMode }) => {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city");
  const queryRange = searchParams.get("range");

  const [city, setCity] = useState<ThaiCity | null>(null);
  const [rangeDays, setRangeDays] = useState<number>(
    queryRange ? parseInt(queryRange) : 7
  );
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  // 🌍 ดึงตำแหน่งผู้ใช้ตอนหน้าโหลด หรือจาก query param
  useEffect(() => {
    if (queryCity) {
      const foundCity = thaiCities.find(
        (c) => c.name.toLowerCase() === queryCity.toLowerCase()
      );
      if (foundCity) return setCity(foundCity);
    }

    if (!navigator.geolocation) {
      setCity(thaiCities.find((c) => c.name === "Bangkok") || thaiCities[0]);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const nearest = thaiCities.reduce((a, b) => {
          const dA = Math.hypot(
            a.lat - coords.latitude,
            a.lon - coords.longitude
          );
          const dB = Math.hypot(
            b.lat - coords.latitude,
            b.lon - coords.longitude
          );
          return dB < dA ? b : a;
        });
        setCity(nearest);
      },
      () => {
        setCity(thaiCities.find((c) => c.name === "Bangkok") || thaiCities[0]);
      }
    );
  }, [queryCity]);

  // 🔄 Fetch hourly และ daily ทุกครั้งที่ city หรือ rangeDays เปลี่ยน
  useEffect(() => {
    if (!city) return;

    const getWeather = async () => {
      try {
        const history = await fetchWeather(city.lat, city.lon);
        const forecast = await fetchForecast(city.lat, city.lon);

        // Daily merge
        const allDaily: DailyData[] = (history.daily?.time || []).map(
          (date: string, i: number) => ({
            date,
            tempMax: history.daily.temperature_2m_max[i],
            tempMin: history.daily.temperature_2m_min[i],
            rainTotal: history.daily.precipitation_sum[i],
          })
        );
        setDailyData(allDaily.slice(-rangeDays));

        // Hourly merge (0,6,12,18)
        const hours = [0, 6, 12, 18];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (rangeDays - 1));

        const mergedHourly: HourlyData[] = [];
        for (
          let d = new Date(startDate);
          d <= today;
          d.setDate(d.getDate() + 1)
        ) {
          hours.forEach((h) => {
            const matchIndex = history.hourly?.time.findIndex((t: string) => {
              const dt = new Date(t);
              return (
                dt.getFullYear() === d.getFullYear() &&
                dt.getMonth() === d.getMonth() &&
                dt.getDate() === d.getDate() &&
                dt.getHours() === h
              );
            });

            mergedHourly.push({
              time:
                matchIndex !== undefined && matchIndex >= 0
                  ? new Date(history.hourly.time[matchIndex])
                  : new Date(d.getFullYear(), d.getMonth(), d.getDate(), h),
              temperature:
                matchIndex !== undefined && matchIndex >= 0
                  ? history.hourly.temperature_2m[matchIndex]
                  : null,
            });
          });
        }

        setHourlyData(mergedHourly);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    getWeather();
  }, [city, rangeDays]);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Range selector + ชื่อเมือง */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-6 h-6 ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            />
            <circle cx="12" cy="9" r="2.5" fill="currentColor" />
          </svg>

          <select
            value={city?.name || ""}
            onChange={(e) => {
              const selected = thaiCities.find(
                (c) => c.name === e.target.value
              );
              if (selected) setCity(selected);
            }}
            className={`p-2 rounded-md border w-full sm:w-auto ${
              darkMode
                ? "bg-[#1e1e1e] border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {thaiCities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}, {c.province}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className={darkMode ? "text-white" : "text-black"}>
            Range Days:
          </label>
          <input
            type="number"
            min={1}
            max={7}
            value={rangeDays}
            onChange={(e) => setRangeDays(parseInt(e.target.value))}
            className={`p-2 rounded-md w-full sm:w-20 border ${
              darkMode
                ? "bg-[#1e1e1e] border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <button
          onClick={() => {
            if (!city) return;
            const url = `${window.location.origin}?city=${city.name}&range=${rangeDays}`;
            navigator.clipboard.writeText(url);
            alert("Link copied!");
          }}
          className="px-4 py-2 w-full sm:w-auto bg-gray-500 hover:bg-[#383838] transition-colors duration-200 text-white rounded-md"
        >
          Copy Link
        </button>
      </div>

      {/* Hourly chart */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
      >
        <h3 className={darkMode ? "text-white" : "text-black"}>
          Hourly (Last {rangeDays} Days)
        </h3>
        {hourlyData.length > 0 ? (
          <HourlyLine hourlyData={hourlyData} darkMode={darkMode} />
        ) : (
          <p className="text-gray-400">Loading hourly data...</p>
        )}
      </div>

      {/* Daily summary */}
      <div
        className={`p-4 rounded-lg ${darkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
      >
        <h3 className={darkMode ? "text-white" : "text-black"}>
          Daily Summary
        </h3>
        {dailyData.length > 0 ? (
          <DailySummer data={dailyData} darkMode={darkMode} />
        ) : (
          <p className="text-gray-400">Loading daily summary...</p>
        )}
      </div>
    </div>
  );
};

export default ChartPage;
