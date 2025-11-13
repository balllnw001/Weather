"use client";

import React from "react";
import styles from "../../css/ThemeToggle.module.css";

interface SunMoonToggleProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const SunMoonToggle: React.FC<SunMoonToggleProps> = ({
  darkMode,
  setDarkMode,
}) => {
  const handleToggle = () => setDarkMode(!darkMode);

  return (
    <div className={styles.switch}>
      <label htmlFor="toggle">
        <input
          id="toggle"
          type="checkbox"
          checked={!darkMode} // day mode = !darkMode
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
