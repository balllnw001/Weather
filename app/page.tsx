"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "./components/navbar";
import Dashboard from "./components/dashboard";
import CompareMode from "./components/comparemode";
const Maps = dynamic(() => import("./components/maps"), { ssr: false });
import Login from "./components/auth/login";

export default function Home() {
  const router = useRouter();

  const [selectedRange, setSelectedRange] = useState<number | null>(7);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCity, setSelectedCity] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // User state
  const [user, setUser] = useState<{ name: string; token: string } | null>(
    null
  );

  // โหลดค่า darkMode จาก localStorage ตอน client mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("darkMode");
    if (saved) setDarkMode(saved === "true");
  }, []);

  // update body class & localStorage
  useEffect(() => {
    if (!mounted) return;
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode, mounted]);

  // Login / Logout
  const handleLogin = (userData: { name: string; token: string }) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setActiveTab("dashboard");
    setSelectedCity(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            selectedCity={selectedCity}
            range={selectedRange || 7}
            darkMode={darkMode}
          />
        );
      case "comparemode":
        return <CompareMode darkMode={darkMode} />;
      case "maps":
        return <Maps darkMode={darkMode} />;
      case "login":
        return <Login darkMode={darkMode} onLogin={handleLogin} />;
      default:
        return (
          <Dashboard
            selectedCity={selectedCity}
            range={selectedRange || 7}
            darkMode={darkMode}
          />
        );
    }
  };

  if (!mounted) return null; // ป้องกันแฟลชค่า darkMode ก่อน client mount

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center ${
        darkMode ? "bg-[#1e1e1e]" : "bg-gray-200"
      }`}
    >
      <div
        className={`m-4 sm:m-2 flex flex-col lg:flex-row gap-6 
        w-full max-w-[1400px] 
        backdrop-blur-lg 
        border border-gray-600/50 
        rounded-xl shadow-2xl
        px-4 md:py-6 md:px-4 py-4 ${
          darkMode ? "bg-[#2c2c2c]" : "bg-gray-800/20"
        }`}
      >
        {/* Header */}
        <div className="w-full flex flex-col gap-5">
          <Navbar
            selectedCity={selectedCity}
            range={selectedRange || 7}
            onCitySelect={(city) => setSelectedCity(city)}
            onRangeSelect={(range) => setSelectedRange(range)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            username={user?.name}
            onLogout={handleLogout}
            onTabChange={(tab: string) => setActiveTab(tab)}
          />

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6 h-full">
            <div
              className={`flex-1 min-h-[400px] rounded-lg lg:p-0 ${
                darkMode ? "bg-transparent" : "bg-transparent"
              }`}
            >
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
