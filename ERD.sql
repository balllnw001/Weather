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
