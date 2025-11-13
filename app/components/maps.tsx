"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// แก้ไอคอน Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  timezone?: string;
}

interface Props {
  darkMode: boolean;
}

const Locations = ({ darkMode }: Props) => {
  const [cities, setCities] = useState<City[]>([]);
  const [newCity, setNewCity] = useState<{ lat: number; lon: number } | null>(null);
  const [cityNameInput, setCityNameInput] = useState("");
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [timezoneInput, setTimezoneInput] = useState("");

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/locations");
        const data: City[] = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchCities();
  }, []);

  // อัพเดต marker จาก input
  useEffect(() => {
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (!isNaN(lat) && !isNaN(lon)) {
      setNewCity({ lat, lon });
    }
  }, [latInput, lonInput]);

  // click บน map
  function ClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setNewCity({ lat, lon: lng });
        setLatInput(lat.toFixed(6));
        setLonInput(lng.toFixed(6));
      },
    });
    return null;
  }

  // เพิ่มเมือง
  const handleAddCity = () => {
    const name = cityNameInput.trim();
    if (!name) {
      alert("กรุณากรอกชื่อเมืองก่อนเพิ่ม!");
      return;
    }
    if (!newCity) {
      alert("กรุณากรอก Lat/Lon ก่อนเพิ่ม!");
      return;
    }

    const cityToAdd: City = {
      id: Math.random(), // temporary id
      name,
      lat: newCity.lat,
      lon: newCity.lon,
      timezone: timezoneInput.trim(),
    };

    setCities((prev) => [...prev, cityToAdd]);
    setCityNameInput("");
    setLatInput("");
    setLonInput("");
    setTimezoneInput("");
    setNewCity(null);
  };

  // ลบเมือง
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await fetch(`/locations/${id}`, { method: "DELETE" });
      setCities((prev) => prev.filter((city) => city.id !== id));
    } catch (err) {
      console.error("Failed to delete city:", err);
      alert("ไม่สามารถลบเมืองได้");
    }
  };

  return (
    <div className="flex gap-4 lg:gap-2 flex-col lg:flex-row">
      {/* Map */}
      <div className="flex w-full lg:w-2/3">
        <MapContainer
          center={[13.7563, 100.5018]}
          zoom={6}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer
            url={
              darkMode
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            }
            attribution="&copy; OpenStreetMap contributors"
          />

          <ClickHandler />

          {newCity && (
            <Marker position={[newCity.lat, newCity.lon]}>
              <Popup>
                <strong>ตำแหน่งใหม่</strong>
                <br />
                Lat: {newCity.lat.toFixed(4)}, Lon: {newCity.lon.toFixed(4)}
              </Popup>
            </Marker>
          )}

          {cities.map((city) => (
            <Marker key={city.id} position={[city.lat, city.lon]}>
              <Popup>
                <strong>{city.name}</strong>
                <br />
                Lat: {city.lat.toFixed(4)}, Lon: {city.lon.toFixed(4)}
                <br />
                {city.timezone && `Timezone: ${city.timezone}`}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Form + List */}
      <div className="flex w-full lg:w-1/3">
        <div
          className={`h-full rounded-[15px] p-4 flex flex-col gap-2 w-full ${
            darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
          }`}
        >
          {/* Form เพิ่มเมือง */}
          <p className="text-lg font-semibold">Add LandMark</p>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col w-full gap-3">
              <input
                type="text"
                value={cityNameInput}
                onChange={(e) => setCityNameInput(e.target.value)}
                placeholder="City..."
                className={`w-full border rounded-[5px] p-2 ${
                  darkMode
                    ? "bg-[#2a2a2a] text-white border-white/50"
                    : "bg-white text-black border-black/50"
                }`}
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  placeholder="Latitude"
                  className={`w-full border rounded-[5px] p-2 ${
                    darkMode
                      ? "bg-[#2a2a2a] text-white border-white/50"
                      : "bg-white text-black border-black/50"
                  }`}
                />
                <input
                  type="text"
                  value={lonInput}
                  onChange={(e) => setLonInput(e.target.value)}
                  placeholder="Longitude"
                  className={`w-full border rounded-[5px] p-2 ${
                    darkMode
                      ? "bg-[#2a2a2a] text-white border-white/50"
                      : "bg-white text-black border-black/50"
                  }`}
                />
              </div>

              <select
                value={timezoneInput}
                onChange={(e) => setTimezoneInput(e.target.value)}
                className={`w-full border rounded-[5px] p-2 ${
                  darkMode
                    ? "bg-[#2a2a2a] text-white border-white/50"
                    : "bg-white text-black border-black/50"
                }`}
              >
                <option value="">-- Select Timezone --</option>
                <option value="Asia/Bangkok">Asia/Bangkok</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <button
              onClick={handleAddCity}
              className={`w-full lg:w-auto h-[100px] lg:h-full border rounded-[5px] px-6 py-2 ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Add
            </button>
          </div>

          {/* List */}
          <p className="text-lg font-semibold">List Favourite Mark</p>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[550px] border p-2 rounded-md">
            {cities.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">
                ยังไม่มีเมืองที่บันทึก
              </p>
            ) : (
              cities.map((city) => (
                <div
                  key={city.id}
                  className={`px-3 py-2 rounded-md flex flex-col ${
                    darkMode ? "bg-[#2a2a2a]" : "bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p>{city.name}</p>
                    <button
                      className="text-red-400"
                      onClick={() => handleDelete(city.id)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p className="text-xs">
                    Lat: {city.lat.toFixed(4)} | Lon: {city.lon.toFixed(4)}{" "}
                    {city.timezone && `| Timezone: ${city.timezone}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Locations;
