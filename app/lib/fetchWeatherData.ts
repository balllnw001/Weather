export async function fetchWeatherData(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&past_days=6&forecast_days=1&timezone=auto`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await res.json();
  return data;
}