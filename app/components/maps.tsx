'use client';

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// dynamic import โดยปิด SSR
const LocationsMap = dynamic(() => import("./LocationsMap"), { ssr: false });

const Locations = ({ darkMode }: { darkMode: boolean }) => {
  const [cities, setCities] = useState<any[]>([]);
  const [newCity, setNewCity] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // fetch จาก API
    const fetchCities = async () => {
      try {
        const res = await fetch("/locations");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="flex w-full">
      <LocationsMap darkMode={darkMode} cities={cities} newCity={newCity} setNewCity={setNewCity} />
    </div>
  );
};

export default Locations;
