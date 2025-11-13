// fetchweather.ts

// ⛅ ดึงข้อมูลสภาพอากาศย้อนหลัง 7 วัน
export async function fetchWeather(lat: number, lon: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 6); // ย้อนหลัง 7 วัน

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // เพิ่ม windspeed_10m ใน hourly
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&current_weather=true&timezone=auto&start_date=${formatDate(
    start
  )}&end_date=${formatDate(now)}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// 🌤️ ดึงข้อมูลพยากรณ์ล่วงหน้า 7 วัน
export async function fetchForecast(lat: number, lon: number) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  end.setDate(now.getDate() + 6); // ล่วงหน้า 7 วัน

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  // เพิ่ม windspeed_10m ใน hourly
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,sunrise,sunset&current_weather=true&timezone=auto&start_date=${formatDate(
    start
  )}&end_date=${formatDate(end)}`;

  const res = await fetch(url);
  const data = await res.json();
  return data;
}
