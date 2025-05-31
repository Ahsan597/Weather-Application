

import React, { useState, useEffect } from 'react';
import "../index.css"; // Ensure Roboto font is imported

const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c";

function formatTime(ts, options = { hour: "numeric", hour12: true }) {
  return new Date(ts).toLocaleTimeString([], options);
}

function formatDay(ts) {
  return new Date(ts).toLocaleDateString([], { weekday: "short" });
}

const weatherCodeToIcon = (code) => {
  if (code === 1000) return "☀️";
  if (code === 1001) return "☁️";
  if (code === 1100) return "☀️";
  if (code === 1101) return "🌤️";
  if (code === 1102) return "☁️";
  if (code >= 2000 && code <= 2100) return "🌫️";
  if ([4000, 4001, 4200, 4201].includes(code)) return "🌧️";
  if ([5000, 5001, 5100, 5101].includes(code)) return "❄️";
  if ([6000, 6001, 6200, 6201, 7000, 7101, 7102].includes(code)) return "🧊";
  if (code >= 8000 && code < 9000) return "⛈️";
  return "🌡️";
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      return;
    }

    const fetchWeather = async (latitude, longitude) => {
      try {
        const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,temperatureApparent,weatherCode,humidity,windSpeed,temperatureMin,temperatureMax&timesteps=current,1h,1d&units=metric&apikey=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch weather data.");
        const data = await res.json();
        setWeather(data.data.timelines);
        setLoading(false);
      } catch (err) {
        setError(`Weather fetch error: ${err.message}`);
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
      (geoError) => {
        let msg = "Geolocation error.";
        if (geoError.code === 1) msg = "Location access denied.";
        else if (geoError.code === 2) msg = "Location unavailable.";
        else if (geoError.code === 3) msg = "Geolocation request timed out.";
        setError(msg);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-lg animate-pulse font-roboto">Loading weather...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-600 font-roboto">{error}</div>;
  if (!weather) return null;

  const currentTimeline = weather.find(t => t.timestep === "current");
  const hourlyTimeline = weather.find(t => t.timestep === "1h");
  const dailyTimeline = weather.find(t => t.timestep === "1d");

  if (!currentTimeline || !hourlyTimeline || !dailyTimeline) {
    return <div className="flex justify-center items-center h-screen text-yellow-600 font-roboto">Incomplete weather data.</div>;
  }

 // Format selectedDate to YYYY-MM-DD
const selectedDayStr = selectedDate
  ? new Date(selectedDate).toISOString().split("T")[0]
  : new Date().toISOString().split("T")[0];

// Filter hourly data to selected date
const hourly = hourlyTimeline.intervals.filter(({ startTime }) =>
  startTime.startsWith(selectedDayStr)
);

// Use first hour as current for selected day
const current = hourly.length > 0 ? hourly[0].values : currentTimeline.intervals[0]?.values;

  const daily = dailyTimeline.intervals.slice(0, 7);

  let lastDay = '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-300 to-indigo-500 text-gray-800 font-['Roboto'] p-6 flex flex-col items-center space-y-10">
      {/* Current Weather */}
      <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-8 w-full max-w-sm text-center text-gray-800 transition hover:scale-105 duration-300">
        <div className="text-2xl font-semibold mb-3">Current Weather</div>
        <div className="text-6xl font-light">{Math.round(current.temperature)}°</div>
        <div className="text-5xl my-3">{weatherCodeToIcon(current.weatherCode)}</div>
        <p className="text-md text-gray-700 mb-4">Feels like {Math.round(current.temperatureApparent)}°</p>
        <div className="grid grid-cols-2 gap-y-3 text-sm border-t pt-4 border-gray-300">
          <div className="text-left">Humidity</div>
          <div className="text-right font-medium">{Math.round(current.humidity)}%</div>
          <div className="text-left">Wind</div>
          <div className="text-right font-medium">{Math.round(current.windSpeed)} m/s</div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 px-1 custom-scrollbar">
          {hourly.map(({ startTime, values }, idx) => {
            const currentHourDay = formatDay(new Date(startTime).getTime());
            const displayDay = currentHourDay !== lastDay;
            lastDay = currentHourDay;

            return (
              <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-between bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 w-[90px] h-[140px] text-white hover:shadow-md transition duration-200">
                <div className="text-xs font-medium opacity-90">
                  {displayDay && <div className="text-sm font-semibold text-white mb-1">{currentHourDay}</div>}
                  {formatTime(new Date(startTime).getTime())}
                </div>
                <div className="text-2xl">{weatherCodeToIcon(values.weatherCode)}</div>
                <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast */}
     {/* Daily Forecast */}
{/* Daily Forecast */}
<div className="w-full max-w-4xl">
  <h2 className="text-xl font-semibold text-white mb-4">Daily Forecast</h2>
  <div className="flex space-x-4 overflow-x-auto pb-2 px-1 custom-scrollbar">
  {daily.map(({ startTime, values }, idx) => {
  const isSelected = startTime.startsWith(selectedDayStr);

  return (
    <div
      key={idx}
      onClick={() => setSelectedDate(startTime)}
      className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-between bg-white/20 backdrop-blur-md border rounded-xl p-4 w-[120px] h-[140px] text-white hover:shadow-md transition duration-200 ${
        isSelected ? "border-white/80 bg-white/30 scale-105" : "border-white/20"
      }`}
    >
      <div className="text-sm font-medium opacity-90 mb-1">
        {formatDay(new Date(startTime).getTime())}
      </div>
      <div className="text-3xl">{weatherCodeToIcon(values.weatherCode)}</div>
      <div className="text-sm font-semibold text-center mt-2">
        {Math.round(values.temperatureMin)}° / {Math.round(values.temperatureMax)}°
      </div>
    </div>
  );
})}

  </div>
</div>


    </div>
  );
};

export default Weather;





