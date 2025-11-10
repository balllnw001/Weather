import React from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  rainTotal: number;
}

interface Props {
  data: DailyData[];
}

const DailySummaryChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        {/* Grid */}
        <CartesianGrid stroke="#2c2c2c" strokeDasharray="4 4" />

        {/* Axes */}
        <XAxis
          dataKey="date"
          tick={{ fill: "#a0aec0", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#555" }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
          }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fill: "#a0aec0", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#555" }}
          domain={["auto", "auto"]}
        />
        {/* <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fill: "#a0aec0", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#555" }}
        /> */}

        {/* Tooltip */}
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div
                  style={{
                    backgroundColor: "#1e1e1e",
                    padding: "10px 15px",
                    borderRadius: 8,
                    color: "#fff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  }}
                >
                  <p style={{ fontWeight: "bold", marginBottom: 6 }}>{label}</p>
                  <p style={{ color: "#f97316" }}>
                    Temp Max:{" "}
                    {payload.find((p) => p.dataKey === "tempMax")?.value} °C
                  </p>
                  <p style={{ color: "#34d399" }}>
                    Temp Min:{" "}
                    {payload.find((p) => p.dataKey === "tempMin")?.value} °C
                  </p>
                  <p style={{ color: "#60a5fa" }}>
                    Rain:{" "}
                    {payload.find((p) => p.dataKey === "rainTotal")?.value} mm
                  </p>
                </div>
              );
            }
            return null;
          }}
        />

        {/* Legend */}
        {/* <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ color: "#a0aec0", fontSize: 12 }}
        /> */}

        {/* Bar */}
        <Bar
          yAxisId="right"
          dataKey="rainTotal"
          name="Rain (mm)"
          fill="#60a5fa"
          barSize={25}
          radius={[5, 5, 0, 0]}
          animationDuration={800}
          label={{
            position: "top",
            fill: "#93c5fd", // สีข้อความบนแท่ง
            fontSize: 12,
            formatter: (value) => `${value}mm`,
          }}
        />

        <defs>
          <linearGradient id="tempMaxGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff0000" /> {/* ร้อน */}
            <stop offset="100%" stopColor="#fcd34d" /> {/* อุ่น */}
          </linearGradient>

          <linearGradient id="tempMinGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" /> {/* หนาว */}
            <stop offset="100%" stopColor="#a3e635" /> {/* เย็น */}
          </linearGradient>
        </defs>

        {/* Max temperature line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="tempMax"
          name="Temp Max (°C)"
          stroke="#f97316" // เส้นหลัก
          strokeWidth={3}
          dot={(props) => {
            const { cx, cy, payload } = props;
            let color = "#fcd34d"; // อุ่น
            if (payload.tempMax >= 20) color = "#f97316"; // ร้อน
            if (payload.tempMax >= 30) color = "#ff0000"; // ร้อนมาก

            return (
              <g>
                <circle cx={cx} cy={cy} r={5} fill={color} />
                <text
                  x={cx}
                  y={cy - 10} // ยกขึ้น 10px จากจุด
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={12}
                >
                  {payload.tempMax}°C
                </text>
              </g>
            );
          }}
          activeDot={{ r: 7, fill: "#fb923c" }}
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="tempMin"
          name="Temp Min (°C)"
          stroke="#34d399"
          strokeWidth={3}
          dot={(props) => {
            const { cx, cy, payload } = props;
            let color = "#a3e635"; // เย็น
            if (payload.tempMin <= 20) color = "#34d399"; // เย็น
            if (payload.tempMin <= 10) color = "#0ea5e9"; // หนาว

            return (
              <g>
                <circle cx={cx} cy={cy} r={5} fill={color} />
                <text
                  x={cx}
                  y={cy + 15} // ขยับลง 15px สำหรับ tempMin
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={12}
                >
                  {payload.tempMin}°C
                </text>
              </g>
            );
          }}
          activeDot={{ r: 7, fill: "#6ee7b7" }}
        />

        {/* Min temperature line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="tempMin"
          name="Temp Min (°C)"
          stroke="#34d399"
          strokeWidth={3}
          dot={(props) => {
            const { cx, cy, payload } = props;
            let color = "#a3e635"; // เย็น
            if (payload.tempMin <= 20) color = "#34d399"; // เย็น
            if (payload.tempMin <= 10) color = "#0ea5e9"; // หนาว

            return (
              <g>
                <circle cx={cx} cy={cy} r={5} fill={color} />
                <text
                  x={cx}
                  y={cy + 15} // ขยับลง 15px สำหรับ tempMin
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={12}
                >
                  {payload.tempMin}°C
                </text>
              </g>
            );
          }}
          activeDot={{ r: 7, fill: "#6ee7b7" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailySummaryChart;
