import React from "react";
import Weather from "./weather";
import ChartAll from "./chart";

interface DashboardProps {
  selectedCity: any;
  range: number | null;
  darkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  selectedCity,
  range,
  darkMode,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full w-full">
      <div className="flex w-full lg:w-[40%] h-full">
        <Weather
          selectedCity={selectedCity}
          range={range}
          darkMode={darkMode}
        />
      </div>
      <div className="flex w-full lg:w-[60%] h-full">
        <ChartAll
          selectedCity={selectedCity}
          range={range}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Dashboard;
