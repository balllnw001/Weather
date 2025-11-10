"use client";

import Image from "next/image";

const windDirection = (deg: number) => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(deg / 45) % 8];
};

const weatherCodeMap: Record<number, string> = {
  0: "Clear",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime Fog",
  51: "Drizzle",
  61: "Rain",
  71: "Snow",
};

const temperature = ({ temper, darkMode }: { temper: any }) => {
  const humidityIndex = temper?.hourly?.time.findIndex((t: string) =>
    t.includes("T12")
  );
  const todayIndex = temper?.daily?.time.findIndex((t: string) =>
    t.includes(new Date().toISOString().split("T")[0])
  );

  const temperatureValue = temper?.current_weather?.temperature;
  const humidityValue = temper?.hourly?.relative_humidity_2m?.[humidityIndex];
  const dewPoint =
    temperatureValue && humidityValue
      ? temperatureValue - (100 - humidityValue) / 5
      : null;

  const items = [
    {
      title: "Humidity",
      value: temper?.hourly?.relative_humidity_2m?.[humidityIndex] + " %",
      sub: `Dew at ${dewPoint !== null ? dewPoint.toFixed(1) + " °C" : "--"}`,
      icon: (
        <svg
          className="text-[#a1a1aa]"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
        >
          <path fill="none" d="M0 0h24v24H0z"></path>
          <path d="M12 13V5c0-1.66-1.34-3-3-3S6 3.34 6 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-2V5c0-.55.45-1 1-1s1 .45 1 1v1H9v1h1v2H9v1h1v1H8zm13-4.5c0-.84-1.5-2.5-1.5-2.5S18 5.66 18 6.5c0 .83.67 1.5 1.5 1.5S21 7.33 21 6.5zm-4 3c0-.84-1.5-2.5-1.5-2.5S14 8.66 14 9.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5zm4 3c0-.84-1.5-2.5-1.5-2.5S18 11.66 18 12.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5z"></path>
        </svg>
      ),
    },
    {
      title: "Wind",
      value: temper?.current_weather?.windspeed?.toFixed(1) + " km/h",
      sub: windDirection(temper?.current_weather?.winddirection),
      icon: (
        <svg
          className="text-[#a1a1aa]"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
        >
          <path d="M156.7 256H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h142.2c15.9 0 30.8 10.9 33.4 26.6 3.3 20-12.1 37.4-31.6 37.4-14.1 0-26.1-9.2-30.4-21.9-2.1-6.3-8.6-10.1-15.2-10.1H81.6c-9.8 0-17.7 8.8-15.9 18.4 8.6 44.1 47.6 77.6 94.2 77.6 57.1 0 102.7-50.1 95.2-108.6C249 291 205.4 256 156.7 256zM16 224h336c59.7 0 106.8-54.8 93.8-116.7-7.6-36.2-36.9-65.5-73.1-73.1-55.4-11.6-105.1 24.9-114.9 75.5-1.9 9.6 6.1 18.3 15.8 18.3h32.8c6.7 0 13.1-3.8 15.2-10.1C325.9 105.2 337.9 96 352 96c19.4 0 34.9 17.4 31.6 37.4-2.6 15.7-17.4 26.6-33.4 26.6H16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16zm384 32H243.7c19.3 16.6 33.2 38.8 39.8 64H400c26.5 0 48 21.5 48 48s-21.5 48-48 48c-17.9 0-33.3-9.9-41.6-24.4-2.9-5-8.7-7.6-14.5-7.6h-33.8c-10.9 0-19 10.8-15.3 21.1 17.8 50.6 70.5 84.8 129.4 72.3 41.2-8.7 75.1-41.6 84.7-82.7C526 321.5 470.5 256 400 256z"></path>
        </svg>
      ),
    },
    {
      title: "Rain",
      value: temper?.daily?.precipitation_sum?.[todayIndex] ?? "--",
      sub: "Since Midnight",
      icon: (
        <svg
          className="text-[#a1a1aa]"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 640 512"
          height="1em"
          width="1em"
        >
          <path d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4z"></path>
        </svg>
      ),
    },
    {
      title: "Condition",
      value: weatherCodeMap[temper?.current_weather?.weathercode] ?? "Unknown",
      sub: `Code : ${temper?.current_weather?.weathercode ?? "--"}`,
      icon: (
        <svg
          className="text-[#a1a1aa]"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
        >
          <path fill="none" d="M0 0h24v24H0V0z"></path>
          <path d="M12 6a9.77 9.77 0 0 1 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5A9.77 9.77 0 0 1 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 1 0-5m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"></path>
        </svg>
      ),
    },
    {
      title: "Sunrise",
      value: temper?.daily?.sunrise?.[todayIndex]?.split("T")[1] ?? "--",
      sub: "Morning",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-12 h-12 text-[#a1a1aa]"
        >
          <defs>
            <clipPath id="a">
              <path
                fill="none"
                d="M512 306H304l-35.9-31.4a18.4 18.4 0 00-24.2 0L208 306H0V0h512Z"
              />
            </clipPath>
            <symbol id="b" viewBox="0 0 375 375">
              <circle
                cx="187.5"
                cy="187.5"
                r="84"
                fill="none"
                stroke="currentColor"
                stroke-miterlimit="10"
                stroke-width="15"
              />
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="15"
                d="M187.5 57.2V7.5m0 360v-49.7m92.2-222.5 35-35M60.3 314.7l35.1-35.1m0-184.4-35-35m254.5 254.5-35.1-35.1M57.2 187.5H7.5m360 0h-49.7"
              >
                <animateTransform
                  additive="sum"
                  attributeName="transform"
                  dur="6s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 187.5 187.5; 45 187.5 187.5"
                />
              </path>
            </symbol>
          </defs>
          <g clip-path="url(#a)">
            <use
              xlinkHref="#b"
              width="375"
              height="375"
              transform="translate(68.5 104.5)"
            />
          </g>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="18"
            d="M128 332h88l40-36 40 36h88"
          />
        </svg>
      ),
    },
    {
      title: "Sunset",
      value: temper?.daily?.sunset?.[todayIndex]?.split("T")[1] ?? "--",
      sub: "Evening",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={`w-12 h-12 ${
            darkMode ? "text-[#a1a1aa]" : "text-[#000]"
          } transition-all duration-400`}
        >
          <defs>
            <clipPath id="a">
              <path
                fill="none"
                d="M512 306H296a21.5 21.5 0 00-14 5.3L256 334l-26-22.7a21.5 21.5 0 00-14-5.3H0V0h512Z"
              />
            </clipPath>
            <symbol id="b" viewBox="0 0 375 375">
              <circle
                cx="187.5"
                cy="187.5"
                r="84"
                fill="none"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="15"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="15"
                d="M187.5 57.2V7.5m0 360v-49.7m92.2-222.5 35-35M60.3 314.7l35.1-35.1m0-184.4-35-35m254.5 254.5-35.1-35.1M57.2 187.5H7.5m360 0h-49.7"
              >
                <animateTransform
                  additive="sum"
                  attributeName="transform"
                  dur="6s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 187.5 187.5; 45 187.5 187.5"
                />
              </path>
            </symbol>
          </defs>
          <g clipPath="url(#a)">
            <use
              xlinkHref="#b"
              width="375"
              height="375"
              transform="translate(68.5 104.5)"
            />
          </g>
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="18"
            d="M128 332h88l40 36 40-36h88"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex w-full">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {items.map(({ title, value, sub, icon }) => (
          <div
            key={title}
            className={`bg-[#1e1e1e] rounded-[15px] p-4 flex flex-col justify-between font-bold gap-2 ${
              darkMode ? "bg-[#1e1e1e]" : "bg-[#fff]"
            } transition-all duration-400`}
          >
            <p
              className={`text-sm ${
                darkMode ? "text-[#a1a1aa]" : "text-[#5c5c5c]"
              } transition-all duration-400`}
            >
              {title}
            </p>
            <p
              className={`text-sm md:text-[16px] text-center flex justify-between items-center gap-2 ${
                darkMode ? "text-[#fff]" : "text-[#000]"
              } transition-all duration-400`}
            >
              {value} <span>{icon}</span>
            </p>
            <p
              className={`text-xs ${
                darkMode ? "text-[#a1a1aa]" : "text-[#5c5c5c]"
              } transition-all duration-400`}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default temperature;
