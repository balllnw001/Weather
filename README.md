# Weather Dashboard Thailand 🌤️

A responsive weather dashboard for Thai cities built with **Next.js 13**, **React**, and **Tailwind CSS**.  
It shows **hourly and daily weather data**, allows selecting cities and forecast ranges, and supports **dark mode**.

---

## Features

- 🌏 **Thai Cities Selector** – Choose from predefined cities or use your current location.
- 📊 **Hourly & Daily Charts** – Interactive line charts and daily summary.
- 🌓 **Dark Mode** – Automatically adapts colors for dark/light themes.
- 📅 **Range Selector** – Display weather for 1–7 days.
- 🔗 **Shareable Link** – Copy a link to share the current city and range.

---

## Demo

![Dashboard Screenshot](/public/Screenshot2.png)
*(Replace with your actual screenshot)*

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# Install dependencies
npm install
# or
yarn

#Data Ingestion
[User / Query Params]
          |
          v
  [Determine City]
          |
          v
 +----------------------+
 | Fetch WeatherHistory | -> Hourly + Daily
 +----------------------+
          |
          v
 +----------------+
 | Fetch Forecast |
 +----------------+
          |
          v
 +-------------------+
 | Map Daily Data    | -> DailySummary Chart
 +-------------------+
          |
          v
 +-------------------+
 | Map Hourly Data   | -> HourlyLine Chart
 +-------------------+

-- 

ผู้ใช้ส่งคำค้น (query params) หรือใช้ตำแหน่ง GPS.

ระบบเลือกเมืองที่ใกล้ที่สุด.

Fetch ข้อมูล Weather History (hourly/daily) และ Forecast (daily).

Map ข้อมูลออกมาเป็น DailyData และ HourlyData.

แสดงผลใน component DailySummary และ HourlyLine.

-- 

Users submit search terms (query parameters) or use GPS location.

The system selects the nearest city.

Fetch weather history (hourly/daily) and forecast (daily) data.

Map data into DailyData and HourlyData.

Displays results in the DailySummary and HourlyLine components.

