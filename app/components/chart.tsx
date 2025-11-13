"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWeather, fetchForecast } from "./api/fetchweather";
import HourlyLine from "../components/chart/HourlyLine";
import DailySummer from "../components/chart/DailySummer";
import { thaiCities } from "../components/api/thaiChities";
import CanvasChart from "./demo/canvaschart";

interface ChartPageProps {
  selectedCity: string | null;
  range: number;
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

const ChartPage: React.FC<ChartPageProps> = ({
  selectedCity: propCity,
  range,
  darkMode,
}) => {
  const searchParams = useSearchParams();
  const queryCity = searchParams.get("city");
  const queryRange = searchParams.get("range");
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [city, setCity] = useState<(typeof thaiCities)[number] | null>(null);
  const [rangeDays, setRangeDays] = useState<number>(
    queryRange && !isNaN(parseInt(queryRange)) ? parseInt(queryRange) : 7
  );
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  // เลือกเมืองจาก prop หรือใช้ตำแหน่งผู้ใช้
  useEffect(() => {
    // 1️⃣ ถ้ามี propCity ให้ใช้ propCity ก่อน
    if (propCity) {
      const cityObj =
        typeof propCity === "string"
          ? thaiCities.find(
              (c) => c.name.toLowerCase() === propCity.toLowerCase()
            )
          : propCity;

      if (cityObj) {
        setSelectedCity(cityObj);
        return;
      }
    }

    // 2️⃣ ถ้ามี queryCity ให้ใช้ queryCity
    const queryCity = searchParams.get("city");
    if (queryCity) {
      const found = thaiCities.find(
        (c) => c.name.toLowerCase() === queryCity.toLowerCase()
      );

      if (found) {
        setSelectedCity(found);
      } else {
        // ถ้าไม่เจอในไทย สร้าง object ชั่วคราว (lat/lon = 0)
        setSelectedCity({ name: queryCity, province: "", lat: 0, lon: 0 });
      }
      return;
    }

    // 3️⃣ fallback → geolocation หรือ Bangkok
    if (!navigator.geolocation) {
      setSelectedCity(
        thaiCities.find((c) => c.name === "Bangkok") || thaiCities[0]
      );
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
        setSelectedCity(nearest);
      },
      () =>
        setSelectedCity(
          thaiCities.find((c) => c.name === "Bangkok") || thaiCities[0]
        )
    );
  }, [propCity, searchParams]);

  // 🔄 Fetch hourly และ daily ทุกครั้งที่ city หรือ rangeDays เปลี่ยน
  useEffect(() => {
    if (!selectedCity) return;

    if (!rangeDays || rangeDays <= 0 || isNaN(rangeDays)) {
      setHourlyData([]);
      setDailyData([]);
      return;
    }

    const getWeather = async () => {
      try {
        const history = (await fetchWeather(
          selectedCity.lat,
          selectedCity.lon
        )) as {
          hourly?: { time: string[]; temperature_2m: (number | null)[] };
          daily?: {
            time: string[];
            temperature_2m_max: number[];
            temperature_2m_min: number[];
            precipitation_sum: number[];
          };
        };

        // const forecast = (await fetchForecast(city.lat, city.lon)) as any;

        // Daily merge
        const allDaily: DailyData[] = (history.daily?.time || []).map(
          (date, i) => ({
            date,
            tempMax: history.daily?.temperature_2m_max[i] ?? 0,
            tempMin: history.daily?.temperature_2m_min[i] ?? 0,
            rainTotal: history.daily?.precipitation_sum[i] ?? 0,
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
            const matchIndex = history.hourly?.time.findIndex((t) => {
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
                  ? new Date(history.hourly!.time[matchIndex])
                  : new Date(d.getFullYear(), d.getMonth(), d.getDate(), h),
              temperature:
                matchIndex !== undefined && matchIndex >= 0
                  ? history.hourly!.temperature_2m[matchIndex]
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
  }, [selectedCity, rangeDays]);

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

          {/* <select
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
          </select> */}
          <label className={darkMode ? "text-white" : "text-black"}>
            {selectedCity?.name || "Loading..."}
          </label>
          {/* <p
            className={
              darkMode ? "text-white font-medium" : "text-black font-medium"
            }
          >
            {propCity || city?.name || "Loading..."}
          </p> */}
        </div>

        {/* Range Days input + buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className={darkMode ? "text-white" : "text-black"}>
            Range Days:
          </label>

          <div
            className={`flex items-center rounded-md overflow-hidden border ${
              darkMode ? "border-gray-600" : "border-gray-300"
            }`}
          >
            <button
              onClick={() => setRangeDays((prev) => Math.max(1, prev - 1))}
              disabled={rangeDays <= 1}
              className={`px-3 py-2 font-bold select-none focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                darkMode
                  ? "bg-[#2b2b2b] text-white hover:bg-[#3a3a3a]"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              −
            </button>

            <input
              type="number"
              readOnly
              value={rangeDays}
              className={`w-16 h-[40px] text-center p-2 appearance-none cursor-default focus:outline-none focus:ring-0 focus:border-transparent ${
                darkMode
                  ? "bg-[#1e1e1e] text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />

            <button
              onClick={() => setRangeDays((prev) => Math.min(7, prev + 1))}
              disabled={rangeDays >= 7}
              className={`px-3 py-2 font-bold select-none focus:outline-none focus:ring-0 focus:border-transparent disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                darkMode
                  ? "bg-[#2b2b2b] text-white hover:bg-[#3a3a3a]"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (!selectedCity || !navigator.clipboard) return;
            const url = `${window.location.origin}?city=${selectedCity.name}&range=${rangeDays}`;
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

      {/* windy */}
      <div
        className={`flex flex-col gap-4 h-full p-4 rounded-lg ${
          darkMode ? "bg-[#1e1e1e]" : "bg-white"
        }`}
      >
        <h3 className={darkMode ? "text-white" : "text-black"}>Windy Map</h3>

        {selectedCity ? (
          <div className="h-64 md:h-80 w-full rounded-md overflow-hidden border border-gray-300">
            <iframe
              width="100%"
              height="100%"
              src={`https://embed.windy.com/embed2.html?lat=${selectedCity.lat}&lon=${selectedCity.lon}&zoom=20&level=surface&overlay=wind&menu=&message=true&type=map&location=coordinates&detail=&detailLat=${selectedCity.lat}&detailLon=${selectedCity.lon}&metricWind=default&metricTemp=default&radarRange=-1`}
              frameBorder="0"
              title="Windy Map"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-400">Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default ChartPage;
