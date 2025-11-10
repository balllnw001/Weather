import { useEffect, useState } from "react";

const SunProgress = ({ sunrise, sunset, darkMode }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000); // อัปเดตทุกนาที
    return () => clearInterval(interval);
  }, []);

  // แปลงเวลาเป็น timestamp (หน่วยมิลลิวินาที)
  const sunriseTime = new Date(sunrise).getTime();
  const sunsetTime = new Date(sunset).getTime();
  const nowTime = now.getTime();

  // คำนวณ progress (%)
  let progress = ((nowTime - sunriseTime) / (sunsetTime - sunriseTime)) * 100;
  progress = Math.min(Math.max(progress, 0), 100); // จำกัด 0–100%

  return (
    <div
      className={`rounded-[15px] p-5 ${
        // bg-gray-100
        darkMode ? "bg-[#1e1e1e]" : "bg-white"
      } flex flex-col gap-3 w-full transition-colors duration-400`}
    >
      <div
        className={`flex justify-between text-sm ${
          darkMode ? "text-white" : "text-black"
        } transition-colors duration-500`}
      >
        <div className="flex items-center gap-1">
          🌅{" "}
          {new Date(sunrise).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
        <div className="flex items-center gap-1">
          🌇{" "}
          {new Date(sunset).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {/* เส้น Progress */}
      <div className="relative w-full h-3 rounded-full bg-gray-600 overflow-hidden">
        {/* เส้น foreground */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        ></div>

        {/* จุดเวลา */}
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{ left: `${progress}%` }}
        >
          <div className="w-4 h-4 rounded-full bg-yellow-300 border-2 border-white shadow-lg animate-pulse"></div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-1">
        {progress < 100
          ? `☀️ Daytime in progress (${progress.toFixed(1)}%)`
          : "🌙 Nighttime"}
      </p>
    </div>
  );
};

export default SunProgress;
