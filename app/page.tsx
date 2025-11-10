"use client";

// import WeatherCard from "./components/weatherCard";
// import Dashboard from "./page/dashboard";
import { useState, useEffect } from "react";
import MDashboard from "./components/maindashboard";
import Main from "./components/index";

import { useRouter } from "next/navigation";

import Navbar from "./components/navbar";

import Dashboard from "./components/dashboard";
import CompareMode from "./components/comparemode";
import Maps from "./components/maps";
import Login from "./components/auth/login";

// import Test from "./components/testbox";

export default function Home() {
  const router = useRouter(); // ✅ ใช้งานได้
  // const { location, range } = router.query;
  const [selectedRange, setSelectedRange] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCity, setSelectedCity] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      return saved === "true" ? true : false;
    }
    return true;
  });

  const [username, setUsername] = useState<string | null>(null); // เก็บชื่อผู้ใช้
  const [token, setToken] = useState<string | null>(null); // เก็บ token

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // ฟังก์ชันเรียกเมื่อ login สำเร็จ
  const [user, setUser] = useState(null);

  const handleLogin = (userData: { name: string; token: string }) => {
    setUser(userData); // แก้ไขตรงนี้
    setUsername(userData.name); // optional
    setToken(userData.token);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setUsername(null);
    setToken(null);
    localStorage.removeItem("token");

    // รีเซ็ต Dashboard โดยเปลี่ยน activeTab เป็น "dashboard" อีกครั้ง
    setActiveTab(""); // set เป็นค่าอื่นก่อน
    setTimeout(() => setActiveTab("dashboard"), 0);

    // รีเซ็ต selectedCity ถ้าต้องการ
    setSelectedCity(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            selectedCity={selectedCity}
            range={selectedRange}
            darkMode={darkMode}
          />
        ); // ส่ง city ให้ Dashboard
      case "comparemode":
        return <CompareMode darkMode={darkMode} />; // ถ้าต้องการ
      case "maps":
        return <Maps darkMode={darkMode} />; // ถ้าต้องการ
      case "login":
        return <Login darkMode={darkMode} onLogin={handleLogin} />;
      default:
        return <Dashboard selectedCity={selectedCity} />;
    }
  };
  return (
    <>
      {/* 1<br />
      dropdrown + search
      <br />
      Card "ล่าสุด" (temp,humidity,wind,rain,condition)
      <br />
      กราฟ เส้น ช่วงเวลา (เช่น 7 วันล่าสุด) จาก /hourly
      <br />
      กราฟ แท่ง/เส้นซ้อน สรุปรายวัลจาก /daily (temp max/min, rain total)
      <br />
      <Dashboard /> */}
      {/* <WeatherCard /> */}
      {/* <MDashboard/> */}
      {/* <Main /> */}
      {/* bg-[url('/img/day.jpg')]  bg-cover bg-center */}
      <div
        className={`min-h-screen w-full flex items-center justify-center text-white ${
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
          {/* <Navbar /> 
          <div className="p-6 w-full flex flex-col gap-5">
            <Header />
            {/* <div className="flex flex-col lg:flex-row gap-4 h-full"> 
            <>
              {/* <Dashboard /> 
              {/* <Locations /> 
              {/* <Maps /> 
              <div className="h-[900px]">{<Test />}</div>
            </>

            {/* </div> 
          </div>*/}
          {/* ส่วน Header */}
          <div className="w-full flex flex-col gap-5">
            <Navbar
              selectedCity={selectedCity}
              rangeDays={selectedRange || 7}
              onCitySelect={(city) => setSelectedCity(city)}
              onRangeChange={(range) => setSelectedRange(range)}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              username={user?.name}
              onLogout={handleLogout}
              onTabChange={(tab: string) => setActiveTab(tab)} // ✅ เพิ่มตรงนี้
            />

            {/* ส่วนเนื้อหาหลัก */}
            <div className="flex flex-col lg:flex-row gap-6 h-full">
              {/* ตัวอย่างการจัด layout responsive */}
              <div
                className={`flex-1 min-h-[400px]  rounded-lg lg:p-0 ${
                  // darkMode ? "bg-[#3c3c3c]" : "bg-gray-900/30"
                  darkMode ? "bg-transparent" : "bg-transparent"
                }`}
              >
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
