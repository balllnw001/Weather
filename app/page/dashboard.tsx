"use client"; // ถ้าใช้ App Router

import { useEffect, useState } from "react";
import { fetchWeatherData } from "@/app/lib/fetchWeatherData";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState({ name: "Bangkok", lat: 13.75, lon: 100.5 });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await fetchWeatherData(city.lat, city.lon);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [city]);

  const weatherCodeMap: Record<number, string> = {
    0: "ท้องฟ้าแจ่มใส",
    1: "มีเมฆเล็กน้อย",
    2: "มีเมฆบางส่วน",
    3: "มีเมฆมาก",
    45: "มีหมอก",
    48: "หมอกน้ำแข็ง",
    51: "ฝนปรอยเบา",
    53: "ฝนปรอยปานกลาง",
    55: "ฝนปรอยหนัก",
    61: "ฝนเบา",
    63: "ฝนปานกลาง",
    65: "ฝนหนัก",
    80: "ฝนตกเป็นช่วง",
    95: "พายุฝนฟ้าคะนอง",
  };

  // if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available.</p>;

  const currentTime = data.current_weather.time;
  const index = data.hourly.time.findIndex((t: string) => t === currentTime);
  const currentHumidity = data.hourly.relative_humidity_2m[index];
  const currentRain = data.hourly.precipitation[index];

  console.log(data.current_weather);
  console.log(data.hourly.relative_humidity_2m[index]);
  console.log(data.hourly.precipitation[index]);
  console.log(index);
  console.log(currentRain);

  return (
    <div className="p-4">
      <div className="flex items-center my-3 gap-2">
        <input type="text" className="border-1 border-white w-full py-1" />
        Search
      </div>

      <h1 className="text-xl font-bold mb-2">
        Weather Dashboard – {city.name}
      </h1>

      <p className="text-2xl">
        {weatherCodeMap[data.current_weather.weathercode] || "ไม่ทราบสภาพอากาศ"}
      </p>

      {/* WeatherCard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">🌡️ Temperature</p>
          <p className="text-2xl text-black">{data.current_weather.temperature} °C</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">💧 Humidity</p>
          <p className="text-2xl text-black">{currentHumidity} %</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">💨 Wind Speed</p>
          <p className="text-2xl text-black">{data.current_weather.windspeed} km/h</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">🌧️ Rain</p>
          <p className="text-2xl text-black">{currentRain} mm</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <p className="text-sm text-gray-500">⛅ Condition</p>
          <p className="text-2xl text-black">{data.current_weather.weathercode}</p>
        </div>
      </div>

      {/* TODO: Chart components */}
      <select
        className="p-2 border"
        onChange={(e) => {
          const [lat, lon] = e.target.value.split(",");
          setCity({
            name: e.target.selectedOptions[0].text,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          });
        }}
      >
        <option value="13.75,100.5">Bangkok</option>
        <option value="18.79,98.98">Chiang Mai</option>
        <option value="7.01,100.5">Songkhla</option>
      </select>
    </div>
  );
}
