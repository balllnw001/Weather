// SunMoonToggle.tsx
"use client";

import React, { useEffect } from "react";
import styles from "../../css/ThemeToggle.module.css";

const SunMoonToggle = ({ darkMode, setDarkMode }) => {
  // โหลดค่า darkMode ตอน mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
      document.body.classList.toggle("dark", savedMode === "true");
    }
  }, []);

  // เปลี่ยน body class + localStorage เมื่อ darkMode เปลี่ยน
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const handleToggle = () => setDarkMode(!darkMode);

  return (
    <div className={styles.switch}>
      <label htmlFor="toggle">
        <input
          id="toggle"
          type="checkbox"
          checked={!darkMode} // ถ้า !darkMode = day mode
          onChange={handleToggle}
          className={styles.toggleSwitch}
        />
        <div className={styles.sunMoon}>
          <div className={styles.dots}></div>
        </div>
        <div className={styles.background}>
          <div className={styles.stars1}></div>
          <div className={styles.stars2}></div>
        </div>
      </label>
    </div>
  );
};

export default SunMoonToggle;
