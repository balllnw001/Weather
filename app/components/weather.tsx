"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchWeather, fetchForecast } from "./api/fetchweather";
import { thaiCities } from "./api/thaiChities";
import { weatherIcons } from "../utils/weatherIcons";
import Temperature from "./weather/temperature";
import SunProgress from "../components/sunset/SunProgress";

interface WeatherProps {
  selectedCity: string | null; // รับ city จาก props หรือ URL
  darkMode: boolean;
}

const Weather: React.FC<WeatherProps> = ({
  selectedCity: propCity,
  darkMode,
}) => {
  const searchParams = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isDayTime, setIsDayTime] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  });

  // เลือกเมืองจาก query หรือ prop หรือ fallback
  useEffect(() => {
    // 1️⃣ query city
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

    // 2️⃣ prop city
    const queryCity = searchParams.get("city");
    if (queryCity) {
      const found = thaiCities.find(
        (c) => c.name.toLowerCase() === queryCity.toLowerCase()
      );
      if (found) {
        setSelectedCity(found);
        return;
      }
    }

    // 3️⃣ fallback → ใช้ geolocation หรือ Bangkok
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

  // ดึงข้อมูลพยากรณ์
  useEffect(() => {
    if (!selectedCity) return;
    (async () => {
      const history = await fetchWeather(selectedCity.lat, selectedCity.lon);
      const forecast = await fetchForecast(selectedCity.lat, selectedCity.lon);
      setWeatherData({ history, forecast });
    })();
  }, [selectedCity]);

  // อัปเดตกลางวัน/กลางคืนทุก 1 นาที
  useEffect(() => {
    const timer = setInterval(() => {
      const h = new Date().getHours();
      setIsDayTime(h >= 6 && h < 18);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const convertTemp = (c: number) => (unit === "C" ? c : (c * 9) / 5 + 32);

  const weather = weatherData?.history?.current_weather;
  const forecast = weatherData?.forecast?.daily;

  console.log("weather.tsx", selectedCity);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* พื้นหลัง */}
      <div
        className={`bg-cover bg-center rounded-[15px] aspect-auto ${
          isDayTime ? "bg-[url('/img/day.jpg')]" : "bg-[url('/img/night.jpg')]"
        }`}
      >
        <div className="inset-0 bg-black/20 rounded-[15px] p-5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-4 w-full">
              {/* เมือง + ปุ่มหน่วย */}
              <div className="flex justify-between w-full text-sm md:text-[16px]">
                <div
                  className={`flex items-center rounded-[15px] p-2 ${
                    darkMode
                      ? "bg-[#292929] text-gray-400"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <svg
                    className="mr-1"
                    viewBox="0 0 24 24"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.81 1.45 1.17 2.26.26.55.47 1.5 1.26 1.5s1-.95 1.25-1.5c.37-.81.7-1.51 1.17-2.26.96-1.53 2.21-2.85 3.16-4.4C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 9.75a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <p>
                    {selectedCity
                      ? `${selectedCity.name}, ${selectedCity.province}`
                      : ""}
                  </p>
                </div>

                <div
                  className={`flex items-center rounded-[15px] p-2 ${
                    darkMode ? "bg-[#292929]" : "bg-gray-300"
                  }`}
                >
                  {["C", "F"].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u as "C" | "F")}
                      className={`mx-1 transition-all ${
                        unit === u
                          ? `font-bold ${
                              darkMode ? "text-white" : "text-black"
                            }`
                          : `font-normal text-gray-400`
                      }`}
                    >
                      °{u}
                    </button>
                  ))}
                </div>
              </div>

              {/* อุณหภูมิ + ไอคอน */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="text-5xl mr-3">🌡️</div>
                  <div>
                    <p className="text-5xl">
                      {weather
                        ? convertTemp(weather.temperature).toFixed(0)
                        : "--"}
                      °{unit}
                    </p>
                    <p className="text-sm text-white">
                      {new Date()
                        .toLocaleDateString("en-US", { weekday: "short" })
                        .toUpperCase()}
                      ,{" "}
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                {weather && (
                  <img
                    src={
                      isDayTime
                        ? weatherIcons[weather.weathercode]?.day?.image
                        : weatherIcons[weather.weathercode]?.night?.image
                    }
                    alt="icon"
                    className="w-[120px] h-[120px]"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* กราฟอุณหภูมิ */}
      <div className="flex">
        {weatherData?.history ? (
          <Temperature temper={weatherData.history} darkMode={darkMode} />
        ) : (
          <p className="text-gray-400">Loading temperature data...</p>
        )}
      </div>

      {/* พยากรณ์ 7 วัน */}
      <div
        className={`rounded-[15px] p-5 flex flex-col gap-6 ${
          darkMode ? "bg-[#1e1e1e]" : "bg-white"
        }`}
      >
        {forecast ? (
          <>
            <p
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Next 7 Days Forecast
            </p>
            <div className="grid grid-cols-7 lg:grid-cols-4 gap-4">
              {forecast.time.slice(0, 7).map((day: string, i: number) => {
                const date = new Date(day);
                const icon =
                  weatherIcons[forecast.weathercode[i]]?.[
                    isDayTime ? "day" : "night"
                  ]?.image || "http://openweathermap.org/img/wn/02d@2x.png";
                return (
                  <div
                    key={i}
                    className={`rounded-[15px] flex flex-col items-center py-4 px-2 hover:scale-105 ${
                      darkMode
                        ? "bg-[#292929] hover:bg-[#3a3a3a]"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {/* ชื่อวัน */}
                    <p
                      className={`text-sm mb-1 ${
                        darkMode ? "text-gray-300" : "text-black"
                      }`}
                    >
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    {/* วันที่เต็ม */}
                    <p
                      className={`text-xs mb-2 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {date.toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <img src={icon} alt="weather" className="w-12 h-12 mb-2" />
                    <p
                      className={`text-md font-medium ${
                        darkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {convertTemp(forecast.temperature_2m_max[i]).toFixed(0)}°{" "}
                      <span className="text-gray-400">
                        /{" "}
                        {convertTemp(forecast.temperature_2m_min[i]).toFixed(0)}
                        °
                      </span>
                    </p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Loading 7-day forecast...
          </div>
        )}
      </div>

      {/* พระอาทิตย์ขึ้นตก */}
      <SunProgress
        sunrise={forecast?.sunrise?.[0]}
        sunset={forecast?.sunset?.[0]}
        darkMode={darkMode}
      />
    </div>
  );
};

export default Weather;
