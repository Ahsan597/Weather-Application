

// import React, { useState, useEffect } from 'react';
// import "../index.css"; // Ensure Roboto font is imported

// const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c";

// function formatTime(ts, options = { hour: "numeric", hour12: true }) {
//   return new Date(ts).toLocaleTimeString([], options);
// }

// function formatDay(ts) {
//   return new Date(ts).toLocaleDateString([], { weekday: "short" });
// }

// const weatherCodeToIcon = (code) => {
//   if (code === 1000) return "☀️";
//   if (code === 1001) return "☁️";
//   if (code === 1100) return "☀️";
//   if (code === 1101) return "🌤️";
//   if (code === 1102) return "☁️";
//   if (code >= 2000 && code <= 2100) return "🌫️";
//   if ([4000, 4001, 4200, 4201].includes(code)) return "🌧️";
//   if ([5000, 5001, 5100, 5101].includes(code)) return "❄️";
//   if ([6000, 6001, 6200, 6201, 7000, 7101, 7102].includes(code)) return "🧊";
//   if (code >= 8000 && code < 9000) return "⛈️";
//   return "🌡️";
// };

// const Weather = () => {
//   const [weather, setWeather] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError("Geolocation not supported by your browser.");
//       setLoading(false);
//       return;
//     }

//     const fetchWeather = async (latitude, longitude) => {
//       try {
//         const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,temperatureApparent,weatherCode,humidity,windSpeed,temperatureMin,temperatureMax&timesteps=current,1h,1d&units=metric&apikey=${API_KEY}`;
//         const res = await fetch(url);
//         if (!res.ok) throw new Error("Failed to fetch weather data.");
//         const data = await res.json();
//         setWeather(data.data.timelines);
//         setLoading(false);
//       } catch (err) {
//         setError(`Weather fetch error: ${err.message}`);
//         setLoading(false);
//       }
//     };

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => fetchWeather(coords.latitude, coords.longitude),
//       (geoError) => {
//         let msg = "Geolocation error.";
//         if (geoError.code === 1) msg = "Location access denied.";
//         else if (geoError.code === 2) msg = "Location unavailable.";
//         else if (geoError.code === 3) msg = "Geolocation request timed out.";
//         setError(msg);
//         setLoading(false);
//       }
//     );
//   }, []);

//   if (loading) return <div className="flex justify-center items-center h-screen text-lg animate-pulse font-roboto">Loading weather...</div>;
//   if (error) return <div className="flex justify-center items-center h-screen text-red-600 font-roboto">{error}</div>;
//   if (!weather) return null;

//   const currentTimeline = weather.find(t => t.timestep === "current");
//   const hourlyTimeline = weather.find(t => t.timestep === "1h");
//   const dailyTimeline = weather.find(t => t.timestep === "1d");

//   if (!currentTimeline || !hourlyTimeline || !dailyTimeline) {
//     return <div className="flex justify-center items-center h-screen text-yellow-600 font-roboto">Incomplete weather data.</div>;
//   }

//  // Format selectedDate to YYYY-MM-DD
// const selectedDayStr = selectedDate
//   ? new Date(selectedDate).toISOString().split("T")[0]
//   : new Date().toISOString().split("T")[0];

// // Filter hourly data to selected date
// const hourly = hourlyTimeline.intervals.filter(({ startTime }) =>
//   startTime.startsWith(selectedDayStr)
// );

// // Use first hour as current for selected day
// const current = hourly.length > 0 ? hourly[0].values : currentTimeline.intervals[0]?.values;

//   const daily = dailyTimeline.intervals.slice(0, 7);

//   let lastDay = '';

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-300 to-indigo-500 text-gray-800 font-['Roboto'] p-6 flex flex-col items-center space-y-10">
//       {/* Current Weather */}
//       <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-8 w-full max-w-sm text-center text-gray-800 transition hover:scale-105 duration-300">
//         <div className="text-2xl font-semibold mb-3">Current Weather</div>
//         <div className="text-6xl font-light">{Math.round(current.temperature)}°</div>
//         <div className="text-5xl my-3">{weatherCodeToIcon(current.weatherCode)}</div>
//         <p className="text-md text-gray-700 mb-4">Feels like {Math.round(current.temperatureApparent)}°</p>
//         <div className="grid grid-cols-2 gap-y-3 text-sm border-t pt-4 border-gray-300">
//           <div className="text-left">Humidity</div>
//           <div className="text-right font-medium">{Math.round(current.humidity)}%</div>
//           <div className="text-left">Wind</div>
//           <div className="text-right font-medium">{Math.round(current.windSpeed)} m/s</div>
//         </div>
//       </div>

//       {/* Hourly Forecast */}
//       <div className="w-full max-w-4xl">
//         <h2 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h2>
//         <div className="flex space-x-4 overflow-x-auto pb-2 px-1 custom-scrollbar">
//           {hourly.map(({ startTime, values }, idx) => {
//             const currentHourDay = formatDay(new Date(startTime).getTime());
//             const displayDay = currentHourDay !== lastDay;
//             lastDay = currentHourDay;

//             return (
//               <div key={idx} className="flex-shrink-0 flex flex-col items-center justify-between bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 w-[90px] h-[140px] text-white hover:shadow-md transition duration-200">
//                 <div className="text-xs font-medium opacity-90">
//                   {displayDay && <div className="text-sm font-semibold text-white mb-1">{currentHourDay}</div>}
//                   {formatTime(new Date(startTime).getTime())}
//                 </div>
//                 <div className="text-2xl">{weatherCodeToIcon(values.weatherCode)}</div>
//                 <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Daily Forecast */}
//      {/* Daily Forecast */}
// {/* Daily Forecast */}
// <div className="w-full max-w-4xl">
//   <h2 className="text-xl font-semibold text-white mb-4">Daily Forecast</h2>
//   <div className="flex space-x-4 overflow-x-auto pb-2 px-1 custom-scrollbar">
//   {daily.map(({ startTime, values }, idx) => {
//   const isSelected = startTime.startsWith(selectedDayStr);

//   return (
//     <div
//       key={idx}
//       onClick={() => setSelectedDate(startTime)}
//       className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-between bg-white/20 backdrop-blur-md border rounded-xl p-4 w-[120px] h-[140px] text-white hover:shadow-md transition duration-200 ${
//         isSelected ? "border-white/80 bg-white/30 scale-105" : "border-white/20"
//       }`}
//     >
//       <div className="text-sm font-medium opacity-90 mb-1">
//         {formatDay(new Date(startTime).getTime())}
//       </div>
//       <div className="text-3xl">{weatherCodeToIcon(values.weatherCode)}</div>
//       <div className="text-sm font-semibold text-center mt-2">
//         {Math.round(values.temperatureMin)}° / {Math.round(values.temperatureMax)}°
//       </div>
//     </div>
//   );
// })}

//   </div>
// </div>


//     </div>
//   );
// };

// export default Weather;





// import React, { useState, useEffect, useMemo } from 'react';
// import "../index.css"; // Ensure Roboto font is imported here

// // Recommended: Move API_KEY to a .env file for security (e.g., process.env.REACT_APP_TOMORROW_IO_KEY)
// const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c";

// // Helper for formatting time (e.g., "1 PM", "2 PM")
// function formatTime(timestamp) {
//   const date = new Date(timestamp);
//   const options = { hour: 'numeric', hour12: true };
//   const timeString = date.toLocaleTimeString([], options);
//   // Optional: Convert "1 PM" to "1P" or similar if desired for compactness
//   return timeString.replace(' ', ''); // Removes space between number and AM/PM
// }

// // Helper for formatting day (e.g., "Mon", "Tue")
// function formatDay(timestamp, long = false) {
//   const date = new Date(timestamp);
//   const options = { weekday: long ? 'long' : 'short' };
//   return date.toLocaleDateString([], options);
// }

// // Map weather codes to emojis (Google uses specific SVGs, this is a close text-based alternative)
// const weatherCodeToIcon = (code) => {
//     // Tomorrow.io Weather Codes (simplified mapping for emojis)
//     // Clear/Sunny
//     if (code === 1000) return "☀️"; // Clear, Sunny
//     if (code === 1100) return "☀️"; // Mostly Clear
//     // Cloudy
//     if (code === 1001) return "☁️"; // Cloudy
//     if (code === 1101) return "🌤️"; // Partly Cloudy
//     if (code === 1102) return "☁️"; // Mostly Cloudy
//     // Fog
//     if (code === 2000 || code === 2100) return "🌫️"; // Fog, Light Fog
//     // Drizzle/Rain
//     if (code === 4000) return "🌧️"; // Drizzle
//     if (code === 4001 || code === 4200 || code === 4201) return "🌧️"; // Rain, Light Rain, Heavy Rain
//     // Snow
//     if (code === 5000 || code === 5001 || code === 5100 || code === 5101) return "❄️"; // Snow, Flurries, Light Snow, Heavy Snow
//     // Freezing Rain / Ice Pellets
//     if (code === 6000 || code === 6001 || code === 6200 || code === 6201 || code === 7000 || code === 7101 || code === 7102) return "🧊"; // Freezing Drizzle, Freezing Rain, Ice Pellets etc.
//     // Thunderstorm
//     if (code === 8000) return "⛈️"; // Thunderstorm

//     return "🌡️"; // Default / Unknown
// };

// const Weather = () => {
//   const [allTimelines, setAllTimelines] = useState(null); // Stores all fetched timelines
//   const [locationName, setLocationName] = useState("Your Location");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [selectedTimestamp, setSelectedTimestamp] = useState(null); // Stores timestamp of selected day/hour

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError("Geolocation not supported by your browser.");
//       setLoading(false);
//       return;
//     }

//     const fetchWeatherAndLocation = async (latitude, longitude) => {
//       try {
//         // Fetch weather data for current, hourly, and daily
//         const weatherUrl = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,temperatureApparent,weatherCode,humidity,windSpeed,precipitationProbability,temperatureMin,temperatureMax&timesteps=current,1h,1d&units=metric&apikey=${API_KEY}`;
//         const weatherRes = await fetch(weatherUrl);
//         const weatherData = await weatherRes.json();

//         if (!weatherRes.ok || !weatherData.data || !weatherData.data.timelines) {
//           throw new Error(weatherData.message || "Failed to fetch weather data.");
//         }
//         setAllTimelines(weatherData.data.timelines);

//         // Set initial selected timestamp to current time for current day display
//         setSelectedTimestamp(Date.now());

//         // Fetch location name using a reverse geocoding service
//         const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=0`;
//         const geoRes = await fetch(geocodingUrl, {
//           headers: { 'User-Agent': 'YourWeatherApp/1.0 (your-email@example.com)' } // Required by Nominatim
//         });
//         const geoData = await geoRes.json();

//         if (geoRes.ok && geoData.address) {
//           const city = geoData.address.city || geoData.address.town || geoData.address.village;
//           const state = geoData.address.state || geoData.address.county;
//           if (city && state) {
//               setLocationName(`${city}, ${state}`);
//           } else if (city) {
//               setLocationName(city);
//           } else if (state) {
//               setLocationName(state);
//           } else {
//               setLocationName("Unknown Location");
//           }
//         } else {
//           setLocationName("Unknown Location");
//         }

//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError(`Failed to load data: ${err.message || err.toString()}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => fetchWeatherAndLocation(coords.latitude, coords.longitude),
//       (geoError) => {
//         let errorMessage = "Location permission denied.";
//         if (geoError.code === geoError.PERMISSION_DENIED) {
//           errorMessage = "Location access denied. Please enable it.";
//         } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
//           errorMessage = "Location information unavailable.";
//         } else if (geoError.code === geoError.TIMEOUT) {
//           errorMessage = "Geolocation request timed out.";
//         }
//         setError(errorMessage);
//         setLoading(false);
//       }
//     );
//   }, []);

//   // --- Derived State from allTimelines and selectedTimestamp ---
//   const currentTimeline = allTimelines?.find(t => t.timestep === "current");
//   const hourlyTimeline = allTimelines?.find(t => t.timestep === "1h");
//   const dailyTimeline = allTimelines?.find(t => t.timestep === "1d");

//   // Filter hourly data for the selected day
//   const filteredHourly = useMemo(() => {
//     if (!hourlyTimeline || !selectedTimestamp) return [];
//     const selectedDayStart = new Date(selectedTimestamp).toISOString().split('T')[0];
//     return hourlyTimeline.intervals.filter(interval =>
//       interval.startTime.startsWith(selectedDayStart)
//     );
//   }, [hourlyTimeline, selectedTimestamp]);

//   // Determine the 'current' weather for the main display based on selectedTimestamp
//   const currentDisplayWeather = useMemo(() => {
//     if (!selectedTimestamp || !allTimelines) return null;

//     // If selected day is today, use the actual 'current' interval from API
//     const now = Date.now();
//     const selectedDateObj = new Date(selectedTimestamp);
//     const today = new Date();
//     today.setHours(0,0,0,0); // Normalize to start of today

//     const isTodaySelected = selectedDateObj.toISOString().split('T')[0] === today.toISOString().split('T')[0];

//     if (isTodaySelected && currentTimeline) {
//       return currentTimeline.intervals[0]?.values;
//     } else if (filteredHourly.length > 0) {
//       // For selected past/future days, use the first hour of that day
//       return filteredHourly[0]?.values;
//     }
//     return null; // Fallback
//   }, [selectedTimestamp, allTimelines, currentTimeline, filteredHourly]);


//   const dailyData = dailyTimeline?.intervals.slice(0, 7) || []; // Get next 7 days
//   const hourlyData = filteredHourly.slice(0, 24); // Get up to 24 hours for selected day

//   // --- Render based on loading/error/data ---
//   if (loading) return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex justify-center items-center font-roboto">
//       <div className="text-xl text-gray-700 animate-pulse">Loading weather...</div>
//     </div>
//   );

//   if (error) return (
//     <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-300 flex justify-center items-center font-roboto">
//       <div className="text-xl text-red-700 p-6 bg-white rounded-lg shadow-md">{error}</div>
//     </div>
//   );

//   if (!allTimelines || !currentDisplayWeather) {
//       // This state implies data issues beyond initial loading/error,
//       // e.g., if a specific timeline or interval is missing after initial fetch.
//       return (
//           <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex justify-center items-center font-roboto">
//               <div className="text-xl text-yellow-700 p-6 bg-white rounded-lg shadow-md">
//                   Weather data is incomplete or unavailable.
//               </div>
//           </div>
//       );
//   }

//   // --- Data for display ---
//   const {
//     temperature,
//     temperatureApparent,
//     weatherCode,
//     humidity,
//     windSpeed,
//     precipitationProbability
//   } = currentDisplayWeather;


//   let lastDayHourly = ''; // To track day changes for hourly forecast display

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-300 via-indigo-300 to-indigo-500 text-white font-roboto p-6 flex flex-col items-center space-y-10">

//       {/* Main Weather Card (Current Day / Selected Day) */}
//       <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-8 w-full max-w-sm text-center transition hover:scale-105 duration-300">
//         <div className="text-2xl font-semibold mb-2">{locationName}</div>
//         <div className="text-sm text-gray-200 mb-4">
//           {formatDay(selectedTimestamp, true)} {/* Full day name for selected day */}
//           {selectedTimestamp && new Date(selectedTimestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
//         </div>

//         <div className="flex flex-col items-center justify-center">
//           <div className="text-7xl mb-2">{weatherCodeToIcon(weatherCode)}</div>
//           <div className="text-7xl font-light leading-none">{Math.round(temperature)}°</div>
//           <p className="text-lg text-gray-200 mt-2">Feels like {Math.round(temperatureApparent)}°</p>
//         </div>

//         {/* Details Section */}
//         <div className="grid grid-cols-2 gap-y-3 text-sm border-t pt-6 border-white/20 mt-6">
//           <div className="text-left opacity-80">Precipitation</div>
//           <div className="text-right font-medium">{precipitationProbability ?? 0}%</div>
//           <div className="text-left opacity-80">Humidity</div>
//           <div className="text-right font-medium">{Math.round(humidity)}%</div>
//           <div className="text-left opacity-80">Wind</div>
//           <div className="text-right font-medium">{Math.round(windSpeed)} m/s</div>
//         </div>
//       </div>

//       {/* Daily Forecast - Horizontal Scroll */}
//       <div className="w-full max-w-4xl">
//         <div className="flex space-x-4 overflow-x-auto pb-3 px-1 custom-scrollbar">
//           {dailyData.map(({ startTime, values }, idx) => {
//             const dayTimestamp = new Date(startTime).getTime();
//             const isSelected = new Date(dayTimestamp).toISOString().split('T')[0] === new Date(selectedTimestamp).toISOString().split('T')[0];

//             return (
//               <div
//                 key={idx}
//                 onClick={() => setSelectedTimestamp(dayTimestamp)}
//                 className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center
//                   bg-white/20 backdrop-blur-md border rounded-xl p-4 w-[110px] h-[130px] text-white
//                   hover:shadow-lg transition duration-200
//                   ${isSelected ? "border-white/80 bg-white/30 scale-105 shadow-xl" : "border-white/20"}
//                 `}
//               >
//                 <div className="text-md font-medium opacity-90 mb-1">
//                   {formatDay(dayTimestamp)}
//                 </div>
//                 <div className="text-3xl mb-1">{weatherCodeToIcon(values.weatherCode)}</div>
//                 <div className="text-sm font-semibold text-center mt-auto">
//                   <span className="opacity-70">{Math.round(values.temperatureMin)}°</span> / {Math.round(values.temperatureMax)}°
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Hourly Forecast - Horizontal Scroll (for selected day) */}
//       <div className="w-full max-w-4xl">
//         <h2 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h2>
//         <div className="flex space-x-4 overflow-x-auto pb-3 px-1 custom-scrollbar">
//           {hourlyData.map(({ startTime, values }, idx) => {
//             const hourTimestamp = new Date(startTime).getTime();
//             const currentHourDay = formatDay(hourTimestamp);
//             const prevHourDay = idx > 0 ? formatDay(new Date(hourlyData[idx - 1].startTime).getTime()) : '';
//             const displayDay = currentHourDay !== prevHourDay;
//             const isCurrentHour = (idx === 0 && new Date(hourTimestamp).getHours() === new Date().getHours()); // Simple check for "Now"

//             return (
//               <div
//                 key={idx}
//                 className="flex-shrink-0 flex flex-col items-center justify-between
//                   bg-white/20 backdrop-blur-md border border-white/20 rounded-xl p-4 w-[90px] h-[140px] text-white
//                   hover:shadow-md transition duration-200"
//               >
//                 <div className="text-xs font-medium opacity-90 text-center mb-1">
//                   {/* Conditionally show Day and Time */}
//                   {displayDay && <div className="text-sm font-semibold mb-1">{currentHourDay}</div>}
//                   {isCurrentHour ? "Now" : formatTime(hourTimestamp)}
//                 </div>
//                 <div className="text-2xl flex-grow flex items-center justify-center">{weatherCodeToIcon(values.weatherCode)}</div>
//                 <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Weather;


import React, { useState, useEffect, useMemo } from 'react';
import "../index.css"; // Ensure Roboto font and custom scrollbar are imported

const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c"; // IMPORTANT: Replace with your actual Tomorrow.io API key, or use a .env file

// Helper for formatting time (e.g., "1 PM", "2 PM")
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const options = { hour: 'numeric', hour12: true };
  const timeString = date.toLocaleTimeString([], options);
  // Removed space for output like "12PM", "3PM" as per your previous example request
  return timeString.replace(' ', '');
}

// Helper for formatting day (e.g., "Sat", "Sun", or "Saturday")
function formatDay(timestamp, long = false) {
  const date = new Date(timestamp);
  const options = { weekday: long ? 'long' : 'short' };
  return date.toLocaleDateString([], options);
}

// Map weather codes to emojis (Google uses specific SVGs, this is a close text-based alternative)
const weatherCodeToIcon = (code) => {
  if (code === 1000 || code === 1100) return "☀️"; // Clear, Sunny, Mostly Clear
  if (code === 1001) return "☁️"; // Cloudy
  if (code === 1101) return "🌤️"; // Partly Cloudy
  if (code === 1102) return "☁️"; // Mostly Cloudy
  if (code === 2000 || code === 2100) return "🌫️"; // Fog
  if ([4000, 4001, 4200, 4201].includes(code)) return "🌧️"; // Rain, Drizzle
  if ([5000, 5001, 5100, 5101].includes(code)) return "❄️"; // Snow
  if ([6000, 6001, 6200, 6201, 7000, 7101, 7102].includes(code)) return "🧊"; // Freezing Rain, Ice Pellets
  if (code === 8000) return "⛈️"; // Thunderstorm
  return "🌡️"; // Default / Unknown
};

// Map weather codes to descriptive strings
const getWeatherDescription = (code) => {
  if (code === 1000) return "Sunny"; // Clear, Sunny
  if (code === 1100) return "Mostly Clear";
  if (code === 1001) return "Cloudy";
  if (code === 1101) return "Partly Cloudy";
  if (code === 1102) return "Mostly Cloudy";
  if (code === 2000) return "Fog"; // Fog
  if (code === 2100) return "Light Fog";
  if (code === 4000) return "Drizzle";
  if (code === 4001) return "Rain";
  if (code === 4200) return "Light Rain";
  if (code === 4201) return "Heavy Rain";
  if (code === 5000) return "Snow";
  if (code === 5001) return "Flurries";
  if (code === 5100) return "Light Snow";
  if (code === 5101) return "Heavy Snow";
  if (code === 6000) return "Freezing Drizzle";
  if (code === 6001) return "Freezing Rain";
  if (code === 6200) return "Light Freezing Rain";
  if (code === 6201) return "Heavy Freezing Rain";
  if (code === 7000) return "Ice Pellets";
  if (code === 7101) return "Heavy Ice Pellets";
  if (code === 7102) return "Light Ice Pellets";
  if (code === 8000) return "Thunderstorm";
  return "Unknown"; // Default / Unknown
};

const Weather = () => {
  const [locationName, setLocationName] = useState("");
  const [allTimelines, setAllTimelines] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTimestamp, setSelectedTimestamp] = useState(null); // Stores timestamp of selected day/hour

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setLoading(false);
      setLocationName(""); // Ensure no placeholder if geolocation not supported
      return;
    }

    const fetchWeatherAndLocation = async (latitude, longitude) => {
      try {
        // Fetch weather data for current, hourly, and daily
        const weatherUrl = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,temperatureApparent,weatherCode,humidity,windSpeed,precipitationProbability,temperatureMin,temperatureMax&timesteps=current,1h,1d&units=metric&apikey=${API_KEY}`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (!weatherRes.ok || !weatherData.data || !weatherData.data.timelines) {
          throw new Error(weatherData.message || "Failed to fetch weather data.");
        }
        setAllTimelines(weatherData.data.timelines);
        // Set initial selected timestamp to the *start* of the current day for daily highlight
        setSelectedTimestamp(new Date().setHours(0, 0, 0, 0));

        // Fetch location name using a reverse geocoding service
        const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=0`;
        const geoRes = await fetch(geocodingUrl, {
          headers: { 'User-Agent': 'YourWeatherApp/1.0 (your-email@example.com)' } // Required by Nominatim
        });
        const geoData = await geoRes.json();

        if (geoRes.ok && geoData.address) {
          const city = geoData.address.city || geoData.address.town || geoData.address.village;
          const state = geoData.address.state || geoData.address.county;
          if (city && state) {
            setLocationName(`${city}, ${state}`);
          } else if (city) {
            setLocationName(city);
          } else if (state) {
            setLocationName(state);
          } else {
            setLocationName(""); // Set to empty string
          }
        } else {
          setLocationName(""); // Set to empty string
        }

      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Failed to load data: ${err.message || err.toString()}`);
        setLocationName(""); // Ensure location is cleared on fetch error
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        console.log("Geolocation obtained:", coords.latitude, coords.longitude);
        fetchWeatherAndLocation(coords.latitude, coords.longitude);
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        let errorMessage = "Location permission denied.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable it in your browser settings.";
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable. Try again later.";
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMessage = "Geolocation request timed out.";
        }
        setError(errorMessage);
        setLoading(false);
        setLocationName(""); // Ensure location is cleared on geolocation error
      }
    );
  }, []);

  // --- Derived State from allTimelines and selectedTimestamp ---
  const currentTimeline = allTimelines?.find(t => t.timestep === "current");
  const hourlyTimeline = allTimelines?.find(t => t.timestep === "1h");
  const dailyTimeline = allTimelines?.find(t => t.timestep === "1d");

  // Filter hourly data for the selected day AND 3-hour intervals
  const filteredHourly = useMemo(() => {
    if (!hourlyTimeline || !selectedTimestamp) {
      console.log("filteredHourly useMemo: Missing hourlyTimeline or selectedTimestamp. Returning empty array.");
      return [];
    }

    const selectedDate = new Date(selectedTimestamp);
    const selectedDayStartStr = selectedDate.toISOString().split('T')[0];
    const todayDate = new Date();
    const todayStr = todayDate.toISOString().split('T')[0];
    const isSelectedDayToday = selectedDayStartStr === todayStr;

    const currentActualHour = todayDate.getHours();

    console.log(`--- Filtering Hourly for ${selectedDayStartStr} (Today: ${isSelectedDayToday}) ---`);
    console.log("Current local actual hour:", currentActualHour);
    console.log("Raw hourly intervals length from API:", hourlyTimeline.intervals.length);

    const result = hourlyTimeline.intervals.filter(interval => {
      const intervalDate = new Date(interval.startTime);
      const intervalDayStr = intervalDate.toISOString().split('T')[0];
      const intervalHour = intervalDate.getHours();

      // 1. Check if the interval falls on the selected day
      if (intervalDayStr !== selectedDayStartStr) {
        return false;
      }

      // 2. Check if it's a 3-hour interval (0, 3, 6, 9, 12, 15, 18, 21)
      if (intervalHour % 3 !== 0) {
        return false;
      }

      // 3. Special handling for "Today": only show hours from the current 3-hour block onwards
      if (isSelectedDayToday) {
        const startOfCurrent3HrBlock = Math.floor(currentActualHour / 3) * 3;
        return intervalHour >= startOfCurrent3HrBlock;
      }

      // For any other selected day (future or past), include all 3-hour intervals (00, 03, ..., 21)
      return true;
    });

    console.log(`Filtered 'result' array for ${selectedDayStartStr} (local hours):`, result.map(i => new Date(i.startTime).getHours()));
    console.log(`Final hourlyData length after slice(0,8): ${result.slice(0, 8).length}`);
    return result.slice(0, 8); // Display up to 8 intervals
  }, [hourlyTimeline, selectedTimestamp]);

  // Determine the 'current' weather for the main display based on selectedTimestamp
  const currentDisplayWeather = useMemo(() => {
    if (!selectedTimestamp || !allTimelines) return null;

    const selectedDateObj = new Date(selectedTimestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isTodaySelected = selectedDateObj.toISOString().split('T')[0] === today.toISOString().split('T')[0];

    // If selected day is today, use the actual 'current' interval from API
    // Otherwise, use the first hour of the selected day from the filtered hourly data
    if (isTodaySelected && currentTimeline) {
      return currentTimeline.intervals[0]?.values;
    } else if (filteredHourly.length > 0) {
      return filteredHourly[0]?.values;
    }
    return null;
  }, [selectedTimestamp, allTimelines, currentTimeline, filteredHourly]);


  // Ensure dailyData is always an array (sliced to 8 days: Today + next 7 days)
  const dailyData = dailyTimeline?.intervals.slice(0, 8) || [];

  // hourlyData is simply the result of filteredHourly, which is already an array
  const hourlyData = filteredHourly;


  // --- Render based on loading/error/data ---
  if (loading) return (
    <div className="min-h-screen bg-white flex justify-center items-center font-roboto">
      <div className="text-xl text-gray-700 animate-pulse">Loading weather...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex justify-center items-center font-roboto">
      <div className="text-xl text-red-700 p-6 bg-white rounded-lg shadow-md">{error}</div>
    </div>
  );

  if (!allTimelines || !currentDisplayWeather) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center font-roboto">
        <div className="text-xl text-yellow-700 p-6 bg-white rounded-lg shadow-md">
          Weather data is incomplete or unavailable.
        </div>
      </div>
    );
  }

  // Destructure for cleaner access in JSX
  const {
    temperature,
    temperatureApparent,
    weatherCode,
    humidity,
    windSpeed,
    precipitationProbability
  } = currentDisplayWeather;

  return (
    // Main container with white background and dark text
    <div className="min-h-screen bg-white ml-20 text-gray-800 font-roboto p-6 flex flex-col items-start space-y-8 sm:space-y-10">

      {/* Main Weather Information (card-like container) */}
      <div className="w-full max-w-sm sm:max-w-xl flex flex-col items-start text-gray-800 space-y-2">

        {/* Top Row: This row specifically uses 'justify-between' to push Location to left and Description/Day to right */}
        <div className="flex justify-between items-start w-full">
          {locationName && <div className="text-2xl font-semibold text-left">{locationName}</div>}
          {/* This div contains "Light Rain" and "Saturday" and is explicitly aligned to the end (right) */}
          {/* Added temporary styling (bg-blue-50) for easier visual confirmation */}
        
        </div>

        {/* NEW "Second Row": Contains (Icon + Temp/Feels Like) on left AND (Details) on right */}
        {/* This div itself needs to be a flex row to place the two main blocks side-by-side */}
        <div className="flex flex-col sm:flex-row items-start justify-start w-full mt-2 sm:space-x-8">

          {/* Left Section: Icon and Temperature/Feels Like */}
          <div className="flex items-center space-x-4 mb-4 sm:mb-0 justify-start">
            <div className="text-7xl">{weatherCodeToIcon(weatherCode)}</div>
            <div className="flex flex-col items-start">
              <div className="text-7xl font-light leading-none">{Math.round(temperature)}°</div>
              {/* <p className="text-lg text-gray-600 mt-2">Feels like {Math.round(temperatureApparent)}°</p> */}
            </div>
          </div>

          {/* Right Section: Details (Precipitation, Humidity, Wind) - Vertically stacked */}
          {/* These need to be vertically stacked, so a flex-col. */}
          <div className="flex flex-col gap-y-1 text-sm w-full sm:w-auto sm:border-l sm:pl-8 sm:border-gray-200">
            {/* Each detail item will be a row with label on left and value on right */}
            <div className="flex justify-between w-full">
              <div className="text-gray-700">Precipitation</div>
              <div className="font-medium">{precipitationProbability ?? 0}%</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="text-gray-700">Humidity</div>
              <div className="font-medium">{Math.round(humidity)}%</div>
            </div>
            <div className="flex justify-between w-full">
              <div className="text-gray-700">Wind</div>
              <div className="font-medium">{Math.round(windSpeed)} m/s</div>
            </div>
          </div>
           <div className="flex flex-col items-end text-right  p-1 rounded">
              <div className="text-xl font-medium">Weather</div>
              <div className="text-md text-gray-600">{formatDay(selectedTimestamp, true)}</div>
            <div className="text-md text-gray-600">{getWeatherDescription(weatherCode)}</div>
            
          </div>
        </div>
      </div>


      {/* Hourly Forecast - Horizontal Scroll */}
      <div className="w-full max-w-4xl mt-4 mb-4">
        <div className="flex space-x-4 overflow-x-auto pb-3 px-1 custom-scrollbar justify-start">
          {hourlyData.map(({ startTime }, idx) => {
            const hourTimestamp = new Date(startTime).getTime();
            return (
              <div
                key={idx}
                className="flex-shrink-0 text-center w-[60px] text-gray-700 p-2"
              >
                <div className="text-sm font-medium">
                  {formatTime(hourTimestamp)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast - Horizontal Scroll */}
      <div className="w-full max-w-4xl">
        <div className="flex space-x-4 overflow-x-auto pb-3 px-1 custom-scrollbar justify-start">
          {dailyData.map(({ startTime, values }, idx) => {
            const dayTimestamp = new Date(startTime).setHours(0, 0, 0, 0);
            const isSelected = dayTimestamp === new Date(selectedTimestamp).setHours(0, 0, 0, 0);

            return (
              <div
                key={idx}
                onClick={() => setSelectedTimestamp(dayTimestamp)}
                className={`cursor-pointer flex-shrink-0 flex flex-col items-center justify-center
                  p-2 w-[100px] text-gray-700
                  hover:bg-gray-100 rounded-lg transition duration-200
                  ${isSelected ? "border-b-2 border-blue-500 font-semibold text-blue-600" : ""}
                `}
              >
                <div className="text-md mb-1">
                  {idx === 0 ? "Today" : formatDay(dayTimestamp)}
                </div>
                <div className="text-3xl mb-1">{weatherCodeToIcon(values.weatherCode)}</div>
                <div className="text-sm text-center">
                  <span className="text-gray-600">{Math.round(values.temperatureMin)}°</span> / {Math.round(values.temperatureMax)}°
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