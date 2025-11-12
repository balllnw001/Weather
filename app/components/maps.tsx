"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface City {
  id: number; // สำหรับ API
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
  const [newCity, setNewCity] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const [cityNameInput, setCityNameInput] = useState("");
  const [latInput, setLatInput] = useState("");
  const [lonInput, setLonInput] = useState("");
  const [timezoneInput, setTimezoneInput] = useState("");

  // Fetch locations จาก API
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

  // Marker update เมื่อ input lat/lon เปลี่ยน
  useEffect(() => {
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (!isNaN(lat) && !isNaN(lon)) {
      setNewCity({ lat, lon });
    }
  }, [latInput, lonInput]);

  // คลิกบนแผนที่
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

  // เพิ่มเมืองใหม่
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

    // สร้าง city object ใหม่
    const cityToAdd: City = {
      id: Math.random(), // ใช้ random เป็น id ชั่วคราว
      name,
      lat: newCity.lat,
      lon: newCity.lon,
      timezone: timezoneInput.trim(),
    };

    // เพิ่มลง state
    setCities((prev) => [...prev, cityToAdd]);

    // รีเซ็ต form
    setCityNameInput("");
    setLatInput("");
    setLonInput("");
    setTimezoneInput("");
    setNewCity(null);
  };

  // ลบเมือง
  const handleDelete = async (id?: number, index?: number) => {
    if (!id) return;
    try {
      await fetch(`/locations/${id}`, { method: "DELETE" });
      setCities((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Failed to delete city:", err);
      alert("ไม่สามารถลบเมืองได้");
    }
  };

  return (
    <div className="flex gap-4 lg:gap-2 flex-col lg:flex-row">
      {/* แผนที่ */}
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

          {cities.map((city, idx) => (
            <Marker key={city.id || idx} position={[city.lat, city.lon]}>
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

      {/* ฟอร์มและ list */}
      <div className="flex w-full lg:w-1/3">
        <div
          className={`h-full rounded-[15px] p-4 flex flex-col gap-2 w-full ${
            darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
          }`}
        >
          <p className="text-lg font-semibold">Add LandMark</p>

          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex flex-col w-full gap-3">
              <div className="flex items-center gap-3">
                <label className="hidden md:block w-[60px] lg:w-auto text-center text-sm ">
                  City
                </label>
                <input
                  type="text"
                  value={cityNameInput}
                  onChange={(e) => setCityNameInput(e.target.value)}
                  className={`w-full border rounded-[5px] p-2 focus:outline-none ${
                    darkMode
                      ? "bg-[#2a2a2a] text-white border-white/50 focus:border-white"
                      : "bg-white text-black border-black/50 focus:border-black"
                  }`}
                  placeholder="City..."
                />
              </div>

              <div className="flex flex-col xl:flex-row gap-3">
                <div className="flex items-center gap-3 w-full">
                  <label className="hidden md:block w-[60px] lg:w-auto text-center text-sm ">
                    Lat
                  </label>
                  <input
                    type="text"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className={`w-full border rounded-[5px] p-2 focus:outline-none ${
                      darkMode
                        ? "bg-[#2a2a2a] text-white border-white/50 focus:border-white"
                        : "bg-white text-black border-black/50 focus:border-black"
                    }`}
                    placeholder="Latitude"
                  />
                </div>

                <div className="flex items-center gap-3 w-full">
                  <label className="hidden md:block w-[60px] lg:w-auto text-center text-sm ">
                    Lon
                  </label>
                  <input
                    type="text"
                    value={lonInput}
                    onChange={(e) => setLonInput(e.target.value)}
                    className={`w-full border rounded-[5px] p-2 focus:outline-none ${
                      darkMode
                        ? "bg-[#2a2a2a] text-white border-white/50 focus:border-white"
                        : "bg-white text-black border-black/50 focus:border-black"
                    }`}
                    placeholder="Longitude"
                  />
                </div>
              </div>

              {/* <div className="flex items-center gap-3 w-full">
                <label className="hidden md:block w-[60px] lg:w-auto text-center text-sm ">
                  Timezone
                </label>
                <input
                  type="text"
                  value={timezoneInput}
                  onChange={(e) => setTimezoneInput(e.target.value)}
                  className={`w-full border rounded-[5px] p-2 focus:outline-none ${
                    darkMode
                      ? "bg-[#2a2a2a] text-white border-white/50 focus:border-white"
                      : "bg-white text-black border-black/50 focus:border-black"
                  }`}
                  placeholder="Timezone..."
                />
              </div> */}
              <div className="flex items-center gap-3 w-full">
                <label className="hidden md:block w-[60px] lg:w-auto text-center text-sm">
                  Timezone
                </label>
                <select
                  value={timezoneInput}
                  onChange={(e) => setTimezoneInput(e.target.value)}
                  className={`w-full border rounded-[5px] p-2 focus:outline-none appearance-none ${
                    darkMode
                      ? "bg-[#2a2a2a] text-white border-white/50 focus:border-white"
                      : "bg-white text-black border-black/50 focus:border-black"
                  }`}
                >
                  <option value="">-- Select Timezone --</option>
                  <option value="Asia/Bangkok">Asia/Bangkok</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">
                    America/Los_Angeles
                  </option>
                  <option value="UTC">UTC</option>
                  {/* เพิ่ม timezone อื่น ๆ ตามต้องการ */}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddCity}
              className={`w-full lg:w-auto h-[100px] lg:h-full self-start lg:self-center border rounded-[5px] px-6 py-2 transition-all duration-300 ease-in-out shadow-md cursor-pointer ${
                darkMode
                  ? "border-white text-white hover:bg-white hover:text-black"
                  : "border-black text-black hover:bg-black hover:text-white"
              }`}
            >
              Add
            </button>
          </div>

          <p className="text-lg font-semibold">List Favourite Mark</p>

          <div
            className={`border p-2 flex flex-col gap-2 overflow-y-auto flex-1 rounded-md scrollbar-thin hover:scrollbar-thumb-[#888] transition-all duration-300 max-h-[550px] ${
              darkMode
                ? "border-white/30 scrollbar-thumb-[#555] scrollbar-track-[#2a2a2a]"
                : "border-black/30 scrollbar-thumb-[#ccc] scrollbar-track-[#f0f0f0]"
            }`}
          >
            {cities.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-2">
                ยังไม่มีเมืองที่บันทึก
              </p>
            ) : (
              cities.map((city, i) => (
                <div
                  key={city.id || i}
                  className={`px-3 py-2 rounded-md flex flex-col transition-all duration-200 ${
                    darkMode
                      ? "bg-[#2a2a2a] hover:bg-[#333]"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={
                        darkMode
                          ? "font-medium text-white"
                          : "font-medium text-black"
                      }
                    >
                      {city.name}
                    </p>
                    <button
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded-md transition-all duration-200"
                      onClick={() => handleDelete(city.id, i)}
                    >
                      🗑️
                    </button>
                  </div>
                  <p
                    className={
                      darkMode ? "text-xs text-gray-400" : "text-xs text-black"
                    }
                  >
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
