import React from 'react';

type WeatherCardProps = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
  rain: number;
};

function getWeatherDescription(code: number): string {
  const mapping: Record<number, string> = {
    0: "☀️ Clear sky",
    1: "🌤️ Mainly clear",
    2: "⛅ Partly cloudy",
    3: "☁️ Overcast",
    45: "🌫️ Fog",
    48: "🌫️ Fog (depositing)",
    51: "🌦️ Light drizzle",
    53: "🌦️ Moderate drizzle",
    55: "🌧️ Dense drizzle",
    61: "🌧️ Light rain",
    63: "🌧️ Moderate rain",
    65: "🌧️ Heavy rain",
    71: "❄️ Light snow",
    73: "❄️ Moderate snow",
    75: "❄️ Heavy snow",
    95: "⛈️ Thunderstorm",
  };

  return mapping[code] || "Unknown";
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  windspeed,
  weathercode,
  humidity,
  rain,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-gray-800">
      <div>
        <p className="text-sm text-gray-500">🌡️ Temperature</p>
        <p className="text-xl font-semibold">{temperature}°C</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">💨 Wind Speed</p>
        <p className="text-xl font-semibold">{windspeed} km/h</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">⛅ Condition</p>
        <p className="text-xl font-semibold">{getWeatherDescription(weathercode)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">💧 Humidity</p>
        <p className="text-xl font-semibold">{humidity}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">🌧️ Rain</p>
        <p className="text-xl font-semibold">{rain} mm</p>
      </div>
    </div>
  );
};

export default WeatherCard;
