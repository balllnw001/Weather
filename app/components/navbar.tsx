"use client";

import { useEffect, useState, useRef } from "react";
import { thaiCities } from "../utils/thaiChities";
import { createPortal } from "react-dom";

import SunMoonToggle from "./toggle/sunmoontoggle";

interface HeaderProps {
  onTabChange: (tab: string) => void;
  onCitySelect: (city: string) => void;
  onRangeSelect: (range: number) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  username?: string;
  onLogout: () => void;
}

const Navbar: React.FC<HeaderProps> = ({
  onTabChange,
  onCitySelect,
  onRangeSelect,
  darkMode,
  setDarkMode,
  username, // เพิ่ม prop username
  onLogout,
}) => {
  // const [darkMode, setDarkMode] = useState(true);
  // const toggleDarkMode = () => setDarkMode(!darkMode);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);

  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);

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

  // Dark mode toggle + remember state
  useEffect(() => {
    // ตอน component โหลด ให้ลองอ่านค่าจาก localStorage
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true"); // แปลง string -> boolean
    }
  }, []);

  // ทุกครั้งที่ darkMode เปลี่ยน ให้บันทึกค่าไว้ใน localStorage
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleSelectTab = (tab: string) => {
    onTabChange?.(tab);
    setOpen(false);
  };

  // const handleCityClick = (city) => {
  //   setSelectedCity(city);
  //   setSearchTerm(city.name);
  //   setOpen(false);
  //   onCitySelect?.(city);
  // };

  const handleCityClick = (city, { fromCurrentLocation = false } = {}) => {
    setSelectedCity(city);
    if (!fromCurrentLocation) {
      setSearchTerm(city.name); // ถ้าเป็นจากปุ่ม Current Location ค่อยไม่เซ็ต searchTerm
    } else {
      setSearchTerm(""); // ล้าง search term เพื่อไม่ให้ dropdown โผล่
    }
    setOpen(false);
    onCitySelect?.(city);
  };

  // Filter เมืองตาม search term
  const filteredCities = thaiCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ฟังก์ชันหาเมืองใกล้ที่สุดจากพิกัด
  const getNearestCity = (lat, lon) => {
    return thaiCities.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.lat - lat, prev.lon - lon);
      const currDist = Math.hypot(curr.lat - lat, curr.lon - lon);
      return currDist < prevDist ? curr : prev;
    });
  };

  const handleLoginLogout = () => {
    if (username) {
      // Logout
      onLogout?.(); // ลบ session / token
      handleSelectTab("dashboard"); // set tab เป็น Dashboard
      router.refresh(); // รีเฟรชหน้า Dashboard
    } else {
      handleSelectTab("login"); // ไปหน้า login
    }
  };

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
          {/* {open &&
            createPortal( */}
          <div
            className={`absolute z-10 left-0 top-[60px] sm:top-[70px] w-44 sm:w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-600/40 rounded-xl shadow-lg text-white transition-all duration-300 origin-top ${
              open
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <ul className="text-sm sm:text-base">
              <li
                className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                onClick={() => handleSelectTab("dashboard")}
              >
                Dashboard
              </li>
              <li
                className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                onClick={() => handleSelectTab("comparemode")}
              >
                CompareMode
              </li>
              <li
                className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                onClick={() => handleSelectTab("maps")}
              >
                Maps
              </li>
            </ul>
          </div>
          {/*  ,
              document.body
             )} */}

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
          {/* Search Input */}
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

            {/* Search Dropdown */}
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
                      onClick={() => {
                        setSelectedCity(city); // เลือกเมือง
                        setSearchTerm(""); // ล้าง search term -> dropdown หาย
                        if (onCitySelect) onCitySelect(city); // ส่งค่ากลับไป Home
                      }}
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
                  (err) => {
                    console.error(err);
                    alert("ไม่สามารถเข้าถึงตำแหน่งปัจจุบันได้");
                  }
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
          {/* <div className="flex items-center gap-2">
            <label className="flex items-center cursor-pointer select-none">
              <div className="relative flex items-center justify-between w-16 h-8 sm:w-20 sm:h-9 bg-gray-300 dark:bg-gray-700 rounded-full px-2 transition-colors">
                <span className="text-blue-400 text-base sm:text-lg">🌙</span>
                <span className="text-yellow-400 text-base sm:text-lg">🌞</span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                />
                <div
                  className={`absolute top-1 left-1 w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    darkMode
                      ? "translate-x-8 sm:translate-x-10"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div> */}

          {/* Dark Mode Toggle */}
          <div className="flex items-center">
            <SunMoonToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>

          {/* <div className="hidden md:flex">
            <p>User</p>
          </div> */}

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
