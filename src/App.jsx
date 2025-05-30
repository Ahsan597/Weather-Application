




// import React, { useEffect, useState } from "react";
// import "./index.css"; // Assuming you have a basic index.css or global CSS file
// // Add Google Fonts import to your index.css or directly in your HTML <head>
// /*
//    In your public/index.html or your main CSS file (like index.css),
//    add the following to fetch Roboto font:
//    <link rel="preconnect" href="https://fonts.googleapis.com">
//    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
// */


// const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c"; // Consider moving this to .env

// function formatTime(ts, options = { hour: "numeric", hour12: true }) {
//   // Ensure ts is in milliseconds for Date constructor
//   return new Date(ts).toLocaleTimeString([], options);
// }

// function formatDay(ts) {
//   // Ensure ts is in milliseconds for Date constructor
//   return new Date(ts).toLocaleDateString([], { weekday: "short" });
// }

// // More refined weather code to icon mapping (still text-based for simplicity)
// const weatherCodeToIcon = (code) => {
//   // Clear / Sunny
//   if (code === 1000) return "☀️"; // Clear
//   // Partly Cloudy
//   if (code === 1001) return "☁️"; // Cloudy
//   if (code === 1100) return "☀️"; // Mostly Clear
//   if (code === 1101) return "🌤️"; // Partly Cloudy
//   if (code === 1102) return "☁️"; // Mostly Cloudy

//   // Fog
//   if (code >= 2000 && code <= 2100) return "🌫️"; // Fog

//   // Rain / Drizzle
//   if (code === 4000) return "🌧️"; // Drizzle
//   if (code === 4001) return "🌧️"; // Rain
//   if (code === 4200) return "🌧️"; // Light Rain
//   if (code === 4201) return "🌧️"; // Heavy Rain

//   // Snow
//   if (code === 5000) return "❄️"; // Snow
//   if (code === 5001) return "🌨️"; // Flurries
//   if (code === 5100) return "🌨️"; // Light Snow
//   if (code === 5101) return "❄️"; // Heavy Snow

//   // Freezing Rain / Ice Pellets
//   if (code === 6000) return "🧊🌧️"; // Freezing Drizzle
//   if (code === 6001) return "🧊🌧️"; // Freezing Rain
//   if (code === 6200) return "🧊🌧️"; // Light Freezing Rain
//   if (code === 6201) return "🧊🌧️"; // Heavy Freezing Rain
//   if (code === 7000) return "🧊"; // Ice Pellets
//   if (code === 7101) return "🧊"; // Heavy Ice Pellets
//   if (code === 7102) return "🧊"; // Light Ice Pellets

//   // Thunderstorm (common code range)
//   if (code >= 8000 && code < 9000) return "⛈️"; // Thunderstorm (generic)

//   // Default / Unknown
//   return "🌡️"; // Thermometer icon for unknown
// };


// export default function WeatherApp() {
//   const [weather, setWeather] = useState(null);
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
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.message || "Failed to fetch weather data.");
//         }
//         const data = await res.json();
//         setWeather(data.data.timelines);
//         setLoading(false);
//       } catch (err) {
//         console.error("Weather fetch error:", err);
//         setError(`Failed to fetch weather: ${err.message || err.toString()}`);
//         setLoading(false);
//       }
//     };

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => {
//         fetchWeather(coords.latitude, coords.longitude);
//       },
//       (geoError) => {
//         let errorMessage = "Geolocation permission denied.";
//         if (geoError.code === geoError.PERMISSION_DENIED) {
//           errorMessage = "Location access denied. Please enable it in your browser settings.";
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

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-blue-100 text-gray-700 font-roboto">
//       <div className="text-lg animate-pulse">Loading weather...</div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
//       <div className="text-lg p-4 bg-white rounded-lg shadow-md">{error}</div>
//     </div>
//   );

//   if (!weather) return null; // Should ideally not happen after loading/error checks

//   const currentTimeline = weather.find(t => t.timestep === "current");
//   const hourlyTimeline = weather.find(t => t.timestep === "1h");
//   const dailyTimeline = weather.find(t => t.timestep === "1d");

//   if (!currentTimeline || !hourlyTimeline || !dailyTimeline) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700 font-roboto">
//         <div className="text-lg p-4 bg-white rounded-lg shadow-md">Incomplete weather data received.</div>
//       </div>
//     );
//   }

//   const current = currentTimeline.intervals[0]?.values;
//   // Slice to get next 12 hours including current for consistency
//   const hourly = hourlyTimeline.intervals.slice(0, 12);
//   // Slice to get next 7 days including current
//   const daily = dailyTimeline.intervals.slice(0, 7);

//   if (!current) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
//         <div className="text-lg p-4 bg-white rounded-lg shadow-md">Current weather data is missing.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 text-gray-800 font-roboto p-4 sm:p-6 md:p-8 flex flex-col items-center">
//       {/* Current Weather Card */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center mb-8">
//         <div className="text-3xl font-medium text-gray-700 mb-2">Current Weather</div>
//         <div className="text-6xl font-light text-gray-900 leading-none">{Math.round(current.temperature)}°</div>
//         <div className="text-5xl my-2 leading-none">{weatherCodeToIcon(current.weatherCode)}</div>
//         <p className="text-lg text-gray-600 mb-4">Feels like {Math.round(current.temperatureApparent)}°</p>

//         <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t pt-4 border-gray-200">
//           <div className="text-left">Humidity:</div>
//           <div className="text-right font-medium">{Math.round(current.humidity)}%</div>
//           <div className="text-left">Wind:</div>
//           <div className="text-right font-medium">{Math.round(current.windSpeed)} m/s</div>
//         </div>
//       </div>

//       {/* Hourly Forecast */}
//       <div className="w-full max-w-3xl mb-8">
//         <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Hourly Forecast</h2>
//         <div className="flex space-x-4 pb-4 overflow-x-auto custom-scrollbar"> {/* Added custom-scrollbar class */}
//           {hourly.map(({ startTime, values }, idx) => (
//             <div
//               key={idx}
//               className="flex-shrink-0 flex flex-col items-center justify-between bg-white rounded-xl p-3 w-[80px] h-[120px] shadow-sm text-gray-700 hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="text-xs font-medium opacity-80 mb-1">{formatTime(new Date(startTime).getTime())}</div>
//               <div className="text-3xl flex-grow flex items-center justify-center">{weatherCodeToIcon(values.weatherCode)}</div>
//               <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Daily Forecast */}
//       <div className="w-full max-w-sm">
//         <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Daily Forecast</h2>
//         <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 text-gray-700">
//           {daily.map(({ startTime, values }, idx) => (
//             <div key={idx} className="flex justify-between items-center p-4">
//               <span className="text-md font-medium w-1/3">{formatDay(new Date(startTime).getTime())}</span>
//               <span className="text-2xl w-1/4 text-center">{weatherCodeToIcon(values.weatherCode)}</span>
//               <span className="text-md font-medium w-1/3 text-right">
//                 {Math.round(values.temperatureMin)}° / {Math.round(values.temperatureMax)}°
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }














// import React, { useEffect, useState } from "react";
// import "./index.css"; // Ensure this is imported and has the Google Fonts import

// // (API_KEY, formatTime, formatDay, weatherCodeToIcon functions remain the same)
// const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c";

// function formatTime(ts, options = { hour: "numeric", hour12: true }) {
//   return new Date(ts).toLocaleTimeString([], options);
// }

// function formatDay(ts) {
//   return new Date(ts).toLocaleDateString([], { weekday: "short" });
// }

// const weatherCodeToIcon = (code) => {
//     // Clear / Sunny
//     if (code === 1000) return "☀️"; // Clear
//     // Partly Cloudy
//     if (code === 1001) return "☁️"; // Cloudy
//     if (code === 1100) return "☀️"; // Mostly Clear
//     if (code === 1101) return "🌤️"; // Partly Cloudy
//     if (code === 1102) return "☁️"; // Mostly Cloudy

//     // Fog
//     if (code >= 2000 && code <= 2100) return "🌫️"; // Fog

//     // Rain / Drizzle
//     if (code === 4000) return "🌧️"; // Drizzle
//     if (code === 4001) return "🌧️"; // Rain
//     if (code === 4200) return "🌧️"; // Light Rain
//     if (code === 4201) return "🌧️"; // Heavy Rain

//     // Snow
//     if (code === 5000) return "❄️"; // Snow
//     if (code === 5001) return "🌨️"; // Flurries
//     if (code === 5100) return "🌨️"; // Light Snow
//     if (code === 5101) return "❄️"; // Heavy Snow

//     // Freezing Rain / Ice Pellets
//     if (code === 6000) return "🧊🌧️"; // Freezing Drizzle
//     if (code === 6001) return "🧊🌧️"; // Freezing Rain
//     if (code === 6200) return "🧊🌧️"; // Light Freezing Rain
//     if (code === 6201) return "🧊🌧️"; // Heavy Freezing Rain
//     if (code === 7000) return "🧊"; // Ice Pellets
//     if (code === 7101) return "🧊"; // Heavy Ice Pellets
//     if (code === 7102) return "🧊"; // Light Ice Pellets

//     // Thunderstorm (common code range)
//     if (code >= 8000 && code < 9000) return "⛈️"; // Thunderstorm (generic)

//     // Default / Unknown
//     return "🌡️"; // Thermometer icon for unknown
// };


// export default function WeatherApp() {
//   const [weather, setWeather] = useState(null);
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
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.message || "Failed to fetch weather data.");
//         }
//         const data = await res.json();
//         setWeather(data.data.timelines);
//         setLoading(false);
//       } catch (err) {
//         console.error("Weather fetch error:", err);
//         setError(`Failed to fetch weather: ${err.message || err.toString()}`);
//         setLoading(false);
//       }
//     };

//     navigator.geolocation.getCurrentPosition(
//       ({ coords }) => {
//         fetchWeather(coords.latitude, coords.longitude);
//       },
//       (geoError) => {
//         let errorMessage = "Geolocation permission denied.";
//         if (geoError.code === geoError.PERMISSION_DENIED) {
//           errorMessage = "Location access denied. Please enable it in your browser settings.";
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

//   if (loading) return (
//     <div className="flex items-center justify-center min-h-screen bg-blue-100 text-gray-700 font-roboto">
//       <div className="text-lg animate-pulse">Loading weather...</div>
//     </div>
//   );

//   if (error) return (
//     <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
//       <div className="text-lg p-4 bg-white rounded-lg shadow-md">{error}</div>
//     </div>
//   );

//   if (!weather) return null;

//   const currentTimeline = weather.find(t => t.timestep === "current");
//   const hourlyTimeline = weather.find(t => t.timestep === "1h");
//   const dailyTimeline = weather.find(t => t.timestep === "1d");

//   if (!currentTimeline || !hourlyTimeline || !dailyTimeline) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700 font-roboto">
//         <div className="text-lg p-4 bg-white rounded-lg shadow-md">Incomplete weather data received.</div>
//       </div>
//     );
//   }

//   const current = currentTimeline.intervals[0]?.values;
//   const hourly = hourlyTimeline.intervals.slice(0, 12);
//   const daily = dailyTimeline.intervals.slice(0, 7);

//   if (!current) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
//         <div className="text-lg p-4 bg-white rounded-lg shadow-md">Current weather data is missing.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 text-gray-800 font-roboto p-4 sm:p-6 md:p-8 flex flex-col items-center">
//       {/* Current Weather Card */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center mb-8">
//         <div className="text-3xl font-medium text-gray-700 mb-2">Current Weather</div>
//         <div className="text-6xl font-light text-gray-900 leading-none">{Math.round(current.temperature)}°</div>
//         <div className="text-5xl my-2 leading-none">{weatherCodeToIcon(current.weatherCode)}</div>
//         <p className="text-lg text-gray-600 mb-4">Feels like {Math.round(current.temperatureApparent)}°</p>

//         <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t pt-4 border-gray-200">
//           <div className="text-left">Humidity:</div>
//           <div className="text-right font-medium">{Math.round(current.humidity)}%</div>
//           <div className="text-left">Wind:</div>
//           <div className="text-right font-medium">{Math.round(current.windSpeed)} m/s</div>
//         </div>
//       </div>

//       {/* Hourly Forecast */}
//       <div className="w-full max-w-3xl mb-8">
//         <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Hourly Forecast</h2>
//         {/* Key change: flex for horizontal layout, overflow-x-auto for scroll */}
//         <div className="flex flex-row space-x-4 pb-4 overflow-x-auto custom-scrollbar">
//           {hourly.map(({ startTime, values }, idx) => (
//             <div
//               key={idx}
//               className="flex-shrink-0 flex flex-col items-center justify-between bg-white rounded-xl p-3 w-[80px] h-[120px] shadow-sm text-gray-700 hover:shadow-md transition-shadow duration-200"
//             >
//               <div className="text-xs font-medium opacity-80 mb-1">{formatTime(new Date(startTime).getTime())}</div>
//               <div className="text-3xl flex-grow flex items-center justify-center">{weatherCodeToIcon(values.weatherCode)}</div>
//               <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Daily Forecast */}
//       <div className="w-full max-w-sm">
//         <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Daily Forecast</h2>
//         {/* This div naturally stacks children due to default block display, or can be flex-col */}
//         <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 text-gray-700">
//           {daily.map(({ startTime, values }, idx) => (
//             <div key={idx} className="flex justify-between items-center p-4"> {/* Ensure flex is here for internal row layout */}
//               <span className="text-md font-medium w-1/3">{formatDay(new Date(startTime).getTime())}</span>
//               <span className="text-2xl w-1/4 text-center">{weatherCodeToIcon(values.weatherCode)}</span>
//               <span className="text-md font-medium w-1/3 text-right">
//                 <span className="opacity-70">{Math.round(values.temperatureMin)}°</span> / {Math.round(values.temperatureMax)}°
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import "./index.css"; // Ensure this is imported and has the Google Fonts import

// (API_KEY, formatTime, formatDay, weatherCodeToIcon functions remain the same)
const API_KEY = "laHvnmxdu8WRBClCg9F6fgCx5WjoYk5c";

function formatTime(ts, options = { hour: "numeric", hour12: true }) {
  // Ensure ts is in milliseconds for Date constructor
  return new Date(ts).toLocaleTimeString([], options);
}

function formatDay(ts) {
  // Ensure ts is in milliseconds for Date constructor
  return new Date(ts).toLocaleDateString([], { weekday: "short" });
}

const weatherCodeToIcon = (code) => {
    // Clear / Sunny
    if (code === 1000) return "☀️"; // Clear
    // Partly Cloudy
    if (code === 1001) return "☁️"; // Cloudy
    if (code === 1100) return "☀️"; // Mostly Clear
    if (code === 1101) return "🌤️"; // Partly Cloudy
    if (code === 1102) return "☁️"; // Mostly Cloudy

    // Fog
    if (code >= 2000 && code <= 2100) return "🌫️"; // Fog

    // Rain / Drizzle
    if (code === 4000) return "🌧️"; // Drizzle
    if (code === 4001) return "🌧️"; // Rain
    if (code === 4200) return "🌧️"; // Light Rain
    if (code === 4201) return "🌧️"; // Heavy Rain

    // Snow
    if (code === 5000) return "❄️"; // Snow
    if (code === 5001) return "🌨️"; // Flurries
    if (code === 5100) return "🌨️"; // Light Snow
    if (code === 5101) return "❄️"; // Heavy Snow

    // Freezing Rain / Ice Pellets
    if (code === 6000) return "🧊🌧️"; // Freezing Drizzle
    if (code === 6001) return "🧊🌧️"; // Freezing Rain
    if (code === 6200) return "🧊🌧️"; // Light Freezing Rain
    if (code === 6201) return "🧊🌧️"; // Heavy Freezing Rain
    if (code === 7000) return "🧊"; // Ice Pellets
    if (code === 7101) return "🧊"; // Heavy Ice Pellets
    if (code === 7102) return "🧊"; // Light Ice Pellets

    // Thunderstorm (common code range)
    if (code >= 8000 && code < 9000) return "⛈️"; // Thunderstorm (generic)

    // Default / Unknown
    return "🌡️"; // Thermometer icon for unknown
};


export default function WeatherApp() {
  const [weather, setWeather] = useState(null);
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
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch weather data.");
        }
        const data = await res.json();
        setWeather(data.data.timelines);
        setLoading(false);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(`Failed to fetch weather: ${err.message || err.toString()}`);
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeather(coords.latitude, coords.longitude);
      },
      (geoError) => {
        let errorMessage = "Geolocation permission denied.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable it in your browser settings.";
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable.";
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMessage = "Geolocation request timed out.";
        }
        setError(errorMessage);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 text-gray-700 font-roboto">
      <div className="text-lg animate-pulse">Loading weather...</div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
      <div className="text-lg p-4 bg-white rounded-lg shadow-md">{error}</div>
    </div>
  );

  if (!weather) return null;

  const currentTimeline = weather.find(t => t.timestep === "current");
  const hourlyTimeline = weather.find(t => t.timestep === "1h");
  const dailyTimeline = weather.find(t => t.timestep === "1d");

  if (!currentTimeline || !hourlyTimeline || !dailyTimeline) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-700 font-roboto">
        <div className="text-lg p-4 bg-white rounded-lg shadow-md">Incomplete weather data received.</div>
      </div>
    );
  }

  const current = currentTimeline.intervals[0]?.values;
  const hourly = hourlyTimeline.intervals.slice(0, 24); // Get 24 hours for better daily transition display
  const daily = dailyTimeline.intervals.slice(0, 7);

  if (!current) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-700 font-roboto">
        <div className="text-lg p-4 bg-white rounded-lg shadow-md">Current weather data is missing.</div>
      </div>
    );
  }

  // --- Logic for conditional day display in Hourly Forecast ---
  let lastDay = ''; // To track the day and show it only when it changes
  // --- End Logic ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-indigo-400 text-gray-800 font-roboto p-4 sm:p-6 md:p-8 flex flex-col items-center">
      {/* Current Weather Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm text-center mb-8">
        <div className="text-3xl font-medium text-gray-700 mb-2">Current Weather</div>
        <div className="text-6xl font-light text-gray-900 leading-none">{Math.round(current.temperature)}°</div>
        <div className="text-5xl my-2 leading-none">{weatherCodeToIcon(current.weatherCode)}</div>
        <p className="text-lg text-gray-600 mb-4">Feels like {Math.round(current.temperatureApparent)}°</p>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600 border-t pt-4 border-gray-200">
          <div className="text-left">Humidity:</div>
          <div className="text-right font-medium">{Math.round(current.humidity)}%</div>
          <div className="text-left">Wind:</div>
          <div className="text-right font-medium">{Math.round(current.windSpeed)} m/s</div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="w-full max-w-3xl mb-8">
        <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Hourly Forecast</h2>
        <div className="flex flex-row space-x-4 pb-4 overflow-x-auto custom-scrollbar">
          {hourly.map(({ startTime, values }, idx) => {
            const currentHourDay = formatDay(new Date(startTime).getTime());
            const displayDay = currentHourDay !== lastDay;
            lastDay = currentHourDay; // Update lastDay for the next iteration

            return (
              <div
                key={idx}
                className="flex-shrink-0 flex flex-col items-center justify-between bg-white rounded-xl p-3 w-[80px] h-[130px] shadow-sm text-gray-700 hover:shadow-md transition-shadow duration-200" // Adjusted height
              >
                <div className="text-xs font-medium opacity-80 mb-1">
                  {displayDay && <div className="text-sm font-semibold mb-1 text-gray-600">{currentHourDay}</div>}
                  {formatTime(new Date(startTime).getTime())}
                </div>
                <div className="text-3xl flex-grow flex items-center justify-center">{weatherCodeToIcon(values.weatherCode)}</div>
                <div className="text-lg font-bold">{Math.round(values.temperature)}°</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Forecast */}
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-medium text-gray-700 mb-4 pl-2">Daily Forecast</h2>
        <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200 text-gray-700">
          {daily.map(({ startTime, values }, idx) => (
            <div key={idx} className="flex justify-between items-center p-4">
              <span className="text-md font-medium w-1/3">{formatDay(new Date(startTime).getTime())}</span>
              <span className="text-2xl w-1/4 text-center">{weatherCodeToIcon(values.weatherCode)}</span>
              <span className="text-md font-medium w-1/3 text-right">
                <span className="opacity-70">{Math.round(values.temperatureMin)}°</span> / {Math.round(values.temperatureMax)}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}