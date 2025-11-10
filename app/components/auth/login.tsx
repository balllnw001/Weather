"use client";

import React, { useState } from "react";

const Login = ({
  darkMode,
  onLogin,
}: {
  darkMode: boolean;
  onLogin?: (user: { name: string; token: string }) => void;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = "abc123"; // ตัวอย่าง token
    onLogin?.({ name: username, token });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full 
        px-4 py-8 sm:py-12 md:py-16 
        rounded-lg transition-all duration-300
        ${darkMode ? "bg-[#1e1e1e]" : "bg-gray-100 text-gray-900"}
        min-h-[500px] sm:min-h-[600px] md:min-h-[700px]`}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Login</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200
            ${
              darkMode
                ? "border-gray-600 bg-[#1e1e1e] text-white placeholder-gray-400 focus:ring-blue-500"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
            }`}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200
            ${
              darkMode
                ? "border-gray-600 bg-[#1e1e1e] text-white placeholder-gray-400 focus:ring-blue-500"
                : "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-blue-400"
            }`}
          required
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
