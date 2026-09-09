# ⚡ WeatherGPT — Climate Intelligence & Disaster Early Warning System

WeatherGPT is a modern, responsive web application engineered to deliver hyper-localized meteorological data, severe weather risk simulations, multilingual AI advisories, and interactive disaster response mapping.

![WeatherGPT](public/logo.png)

---

## 🌟 Key Features

- **🤖 WeatherGPT AI Assistant**: Contextual natural language weather assistant with multilingual support in English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ).
- **🗺️ Interactive Impact Map**: Leaflet-powered geospatial visualization with real-time overlay simulation for cyclones, flood risk zones, localized lightning strikes, and animated rain radar.
- **🌪️ Disaster Risk Simulator**: Simulation dashboard supporting interactive testing of storm surges, torrential rainfall, and cyclone trajectories with full-screen simulation mode.
- **📊 5-Day / Hourly Forecasts**: Detailed temperature gradients, humidity, UV index, and atmospheric curves powered by Recharts and live API data.
- **🚨 Smart Alerts & Emergency Directory**: Categorized risk alerts and 1-click emergency contacts (112, 1077) with nearby relief shelter locating.
- **🌐 Localization & Theming**: Native multi-language support (EN, HI, OR) and dynamic dark mode interface.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, React Router v7
- **Styling**: Tailwind CSS v4, Custom 3D & Weather Animations
- **Mapping**: Leaflet, React-Leaflet
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Linter & Performance**: Oxlint, Route-based Code Splitting (React.lazy / Suspense)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/soyamshuswain-tech/weatherGPT.git
cd weatherGPT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your API keys in `.env`:
```env
# OpenWeatherMap API Configuration
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# Ola Maps API Configuration
VITE_OLA_MAPS_API_KEY=your_ola_maps_api_key_here
VITE_OLA_MAPS_CLIENT_ID=your_ola_maps_client_id_here
VITE_OLA_MAPS_CLIENT_SECRET=your_ola_maps_client_secret_here
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── assets/          # Static assets & illustrations
├── components/      # UI components & interactive widgets
│   └── map/         # Leaflet animated layers (cyclone, flood, lightning)
├── contexts/        # React contexts (Theme, Location, Language, Alerts)
├── data/            # Mock dataset fallbacks
├── layouts/         # App shell & layout wrappers
├── locales/         # i18n dictionaries (en, hi, or)
├── pages/           # Application views (Home, WeatherGPT, ImpactMap, Forecast, etc.)
├── services/        # Weather, Map, and LLM API integrations
└── styles/          # Custom 3D weather CSS animations
```

---

## 🛡️ Security & Environment

Ensure that sensitive credentials are never committed. The `.gitignore` file is configured to prevent tracking `.env` and local environment files. Always use `.env.example` as a template for team onboarding.
