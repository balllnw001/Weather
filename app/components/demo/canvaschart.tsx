"use client"; // ใช้ใน Next.js App Router เพื่อให้รันฝั่ง client

import { useEffect, useRef } from "react";

export default function CanvasChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ข้อมูลกราฟ
    const data = [100, 150, 80, 200, 120];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const barWidth = 50;
    const gap = 20;
    const baseY = 250;

    // เคลียร์หน้าจอ
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // วาดกราฟแท่ง
    data.forEach((value, i) => {
      const x = 50 + i * (barWidth + gap);
      const y = baseY - value;
      ctx.fillStyle = "skyblue";
      ctx.fillRect(x, y, barWidth, value);

      // label
      ctx.fillStyle = "black";
      ctx.fillText(labels[i], x + 10, baseY + 15);
    });

    // เส้นแกน X
    ctx.beginPath();
    ctx.moveTo(40, baseY);
    ctx.lineTo(400, baseY);
    ctx.strokeStyle = "#555";
    ctx.stroke();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>📊 Bar Chart (Canvas API + Next.js)</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{ border: "1px solid #ccc", background: "#fff" }}
      />
    </div>
  );
}
