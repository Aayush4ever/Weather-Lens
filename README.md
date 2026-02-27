# 🌦️ WeatherLens — Real-time Weather Analytics Dashboard
# LIVE LINK  :  https://weather-lens-sfpl.vercel.app/#/login

A professional, production-grade Weather Analytics Dashboard built with React, Redux Toolkit, Tailwind CSS v4, and the OpenWeatherMap API.

## ✨ Features

| Feature | Description |
|---|---|
| 🌍 Multi-city Dashboard | Summary cards with real-time weather for multiple cities |
| 🔍 City Detail Modal | 5–7 day forecast, hourly breakdown, detailed stats |
| 🔍 Search + Autocomplete | Live city search powered by OpenWeatherMap Geocoding API |
| ⭐ Favorites | Pin cities to sidebar — persists between sessions |
| 📊 Charts | Temperature trends, precipitation, UV index, humidity radar |
| 🧭 Wind Compass | Animated compass with speed, gust, direction, visibility |
| 🗺️ Map View | Visual geographic city map with weather markers |
| ⚠️ Alerts | Dynamic real-time + mock weather alerts |
| 🌡️ C / F Toggle | Switch between Celsius and Fahrenheit globally |
| 🔁 Auto-refresh | Data refreshes every 60 seconds automatically |
| 💾 Caching | 60-second in-Redux cache prevents redundant API calls |
| 📱 Responsive | Works on mobile, tablet, and desktop |

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Aayush4ever/Weather-Lens.git
cd weatherlens
npm install
```

### 2. Configure API Key


```

Edit `.env`:

VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_OPENWEATHER_GEO_URL=https://api.openweathermap.org/geo/1.0
```

> **Get a free API key at:** https://openweathermap.org/api  
> Free tier: 1,000 calls/day — more than enough for this project

### 3. Run

```bash
npm run dev
```

Opens at **http://localhost:3000**

## 🏗️ Tech Stack

| Tech | Version | Purpose |
|---|---|---|
| React | 18.3 | UI Framework |
| Vite | 5.4 | Build tool |
| Redux Toolkit | 2.2 | State management |
| redux-persist | 6.0 | Persisted favorites + settings |
| react-router-dom | 6.26 | Routing |
| Recharts | 2.12 | Charts & visualizations |
| Tailwind CSS | v4 | Styling |
| axios | 1.7 | HTTP requests |
| date-fns | 3.6 | Date formatting |

## 📁 Project Structure

```
src/
├── api/               # OpenWeatherMap API calls + parsers
├── app/               # Redux store
├── components/
│   ├── layout/        # Navbar, Sidebar, SettingsPanel
│   ├── dashboard/     # CityCard, CardsGrid
│   ├── charts/        # All Recharts visualizations
│   ├── detail/        # City detail modal + sub-components
│   ├── search/        # Autocomplete search
│   └── ui/            # Reusable UI primitives
├── features/
│   ├── weather/       # Redux slice + async thunks
│   ├── favorites/     # Persisted favorites
│   └── settings/      # Unit preference, refresh settings
├── hooks/             # useAutoRefresh, useToast
├── pages/             # Dashboard, Analytics, MapView, Alerts
└── utils/             # tempUtils, dateUtils, weatherIcons, cache
```

## 🔑 API Endpoints Used

- `GET /data/2.5/weather` — Current weather
- `GET /data/2.5/forecast` — 5-day / 3h forecast
- `GET /data/2.5/air_pollution` — Air Quality Index
- `GET /geo/1.0/direct` — City search autocomplete

## 📦 Build for Production

```bash
npm run build
npm run preview
```
