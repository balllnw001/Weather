"use client";

import { useEffect, useState, useRef } from "react";
import { thaiCities } from "../components/api/thaiChities";
import { useRouter } from "next/navigation";
import SunMoonToggle from "./toggle/sunmoontoggle";

interface HeaderProps {
  onTabChange: (tab: string) => void;
  onCitySelect: (city: string) => void;
  onRangeSelect: (range: number) => void;
  username?: string;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const Navbar: React.FC<HeaderProps> = ({
  onTabChange,
  onCitySelect,
  onRangeSelect,
  username,
  onLogout,
  darkMode, // เพิ่มตรงนี้
  setDarkMode, // เพิ่มตรงนี้
}) => {
  const router = useRouter();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchDropdownRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<any>(null);

  // Hydration guard ป้องกันแฟลช false
  const [mounted, setMounted] = useState(false);

  // // Dark mode state
  // const [darkMode, setDarkMode] = useState<boolean>(() => {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem("darkMode") === "true";
  //   }
  //   return false; // default สำหรับ SSR
  // });

  // useEffect(() => {
  //   setMounted(true); // client render แล้ว
  // }, []);

  // Update dark mode class & localStorage
  useEffect(() => {
    if (!mounted) return; // รอจน client mount
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode, mounted]);

  // ปิด dropdown เมื่อคลิคนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle city selection
  const handleCityClick = (city: any, { fromCurrentLocation = false } = {}) => {
    setSelectedCity(city);
    setSearchTerm("");
    // setSearchTerm(fromCurrentLocation ? "" : city.name);
    setOpen(false);
    onCitySelect?.(city);
  };

  const filteredCities = thaiCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNearestCity = (lat: number, lon: number) => {
    return thaiCities.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.lat - lat, prev.lon - lon);
      const currDist = Math.hypot(curr.lat - lat, curr.lon - lon);
      return currDist < prevDist ? curr : prev;
    });
  };

  const handleLoginLogout = () => {
    setOpen(false);
    if (username) {
      onLogout?.();
      onTabChange("dashboard");
      router.refresh();
    } else {
      onTabChange("login");
    }
  };

  // ป้องกันแฟลช darkMode ก่อน client mount
  // if (!mounted) return null;

  return (
    <header
      className={`relative z-50 px-4 py-4 rounded-[15px] w-full transition-colors duration-500 ${
        darkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex flex-row items-center justify-between gap-6 w-full">
        {/* Left: Menu + Greeting */}
        <div
          className="flex items-center gap-4 lg:w-full relative"
          ref={dropdownRef}
        >
          {/* Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className={`aspect-square inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all backdrop-blur-md border ${
              darkMode
                ? "border-white text-white hover:bg-white/10"
                : "border-black text-black hover:bg-black/10"
            }`}
          >
            {/* ไอคอนเมนู */}
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 122.88 121.92"
              fill="currentColor"
            >
              <path d="M6.6,121.92H47.51a6.56,6.56,0,0,0,2.83-.64,6.68,6.68,0,0,0,2.27-1.79,6.63,6.63,0,0,0,1.5-4.17V74.58A6.56,6.56,0,0,0,53.58,72,6.62,6.62,0,0,0,50,68.47,6.56,6.56,0,0,0,47.51,68H6.6a6.5,6.5,0,0,0-2.43.48,6.44,6.44,0,0,0-2.11,1.34A6.6,6.6,0,0,0,.55,72,6.3,6.3,0,0,0,0,74.58v40.74a6.54,6.54,0,0,0,.43,2.32,6.72,6.72,0,0,0,1.2,2l.26.27a6.88,6.88,0,0,0,2,1.39,6.71,6.71,0,0,0,2.73.6ZM59.3,28.44,86,1.77A6.19,6.19,0,0,1,88.22.34,6.24,6.24,0,0,1,90.87,0a6,6,0,0,1,3.69,1.74l26.55,26.55a6,6,0,0,1,1.33,2,6.13,6.13,0,0,1-1.33,6.58L94.45,63.58a6,6,0,0,1-1.9,1.27,5.92,5.92,0,0,1-2.24.5,6.11,6.11,0,0,1-2.41-.43,5.74,5.74,0,0,1-2.05-1.34L59.3,37a6.09,6.09,0,0,1-1.76-3.88V32.8a6.14,6.14,0,0,1,1.77-4.36Z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div
              className={`absolute z-10 left-0 top-[60px] sm:top-[70px] w-44 sm:w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-600/40 rounded-xl shadow-lg text-white transition-all duration-300 origin-top`}
            >
              <ul className="text-sm sm:text-base">
                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  onClick={() => {
                    onTabChange("dashboard");
                    setOpen(false);
                  }}
                >
                  Dashboard
                </li>
                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  onClick={() => {
                    onTabChange("comparemode");
                    setOpen(false);
                  }}
                >
                  CompareMode
                </li>
                <li
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                  onClick={() => {
                    onTabChange("maps");
                    setOpen(false);
                  }}
                >
                  Maps
                </li>
              </ul>
            </div>
          )}

          {/* Greeting */}
          <div className="hidden md:flex flex-col text-center sm:text-left">
            <h1 className="text-lg sm:text-xl font-bold">
              👋 Hello {username ? username : "User"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Today is a good day to check the weather 🌤️
            </p>
          </div>
        </div>

        {/* Right: Search + Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search Input + Dropdown */}
          <div className="relative w-full" ref={searchDropdownRef}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search city..."
              className={`w-full px-3 py-2 rounded-[15px] border focus:outline-none focus:ring-2 text-sm sm:text-base transition-all duration-300 ${
                darkMode
                  ? "border-gray-600 bg-[#1e1e1e] text-white placeholder-gray-400 focus:ring-blue-500"
                  : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
              }`}
            />
            {searchTerm && (
              <ul
                className={`absolute top-full left-0 mt-1 z-10 w-full max-h-48 overflow-auto rounded shadow-lg text-sm sm:text-base transition-all duration-300 ${
                  darkMode
                    ? "bg-gray-800 border border-gray-600 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                }`}
              >
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <li
                      key={city.name}
                      onClick={() => handleCityClick(city)}
                      className={`px-3 py-2 cursor-pointer transition ${
                        darkMode ? "hover:bg-gray-600" : "hover:bg-gray-100"
                      }`}
                    >
                      {city.name}, {city.province}
                    </li>
                  ))
                ) : (
                  <li
                    className={`px-3 py-2 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ไม่พบข้อมูล
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Current Location Button */}
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const nearestCity = getNearestCity(latitude, longitude);
                    handleCityClick(nearestCity, { fromCurrentLocation: true });
                  },
                  () => alert("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้")
                );
              } else {
                alert("เบราว์เซอร์นี้ไม่รองรับ Geolocation");
              }
            }}
            className={`aspect-square ml-2 w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${
              darkMode
                ? "border-gray-500 text-white hover:bg-white/10"
                : "border-gray-300 text-black hover:bg-black/10"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22s8-4 8-10-3.582-8-8-8-8 3.582-8 8 8 10 8 10z"
              />
            </svg>
          </button>

          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <SunMoonToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>

          {/* Login / Logout */}
          <div
            onClick={handleLoginLogout}
            className={`text-xs sm:text-sm px-3 py-1 cursor-pointer rounded border transition-colors duration-200 ${
              darkMode
                ? "text-gray-400 border-gray-500 hover:bg-white/10"
                : "text-black border-black hover:bg-gray-100"
            }`}
          >
            {username ? "Logout" : "Login"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
