import React from 'react';
import '../styles/weatherBackground.css';

export default function WeatherBackground({ condition }) {
  const cond = (condition || '').toLowerCase();
  
  const isSunny = cond.includes('sun') || cond.includes('clear');
  const isCloudy = cond.includes('cloud') || cond.includes('overcast');
  const isRainy = cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower');
  const isThunder = cond.includes('thunder') || cond.includes('storm') || cond.includes('lightning');
  const isSnow = cond.includes('snow');
  const isAtmosphere = cond.includes('mist') || cond.includes('fog') || cond.includes('haze') || cond.includes('smoke') || cond.includes('dust');

  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour >= 18;

  let bgClass = isNight ? 'bg-night' : 'bg-sunny';
  
  if (isThunder) bgClass = 'bg-storm';
  else if (isRainy) bgClass = 'bg-rainy';
  else if (isSnow) bgClass = 'bg-snow';
  else if (isAtmosphere) bgClass = isNight ? 'bg-night-cloudy' : 'bg-overcast';
  else if (isCloudy && cond.includes('overcast')) bgClass = isNight ? 'bg-night-cloudy' : 'bg-overcast';
  else if (isCloudy) bgClass = isNight ? 'bg-night-cloudy' : 'bg-cloudy';

  return (
    <div className={`weather-bg-wrapper ${bgClass}`}>
      {!isNight && isSunny && <div className="sun-flare" />}
      {isNight && (!isRainy && !isThunder && !isSnow) && <div className="night-overlay" />}
      
      {isCloudy && !isRainy && !isThunder && !isSnow && (
        <>
          <div className="cloud-layer" style={{ opacity: isNight ? 0.3 : 0.8 }} />
          <div className="cloud-layer-2" style={{ opacity: isNight ? 0.3 : 1 }} />
        </>
      )}

      {(isRainy || isThunder) && (
        <>
          <div className="cloud-layer" style={{ opacity: 0.5, filter: 'brightness(0.5) blur(30px)' }} />
          <div className="rain-overlay" />
        </>
      )}

      {isThunder && <div className="storm-flash" />}

      {isSnow && (
        <>
          <div className="cloud-layer" style={{ opacity: isNight ? 0.4 : 0.8 }} />
          <div className="snow-overlay" />
        </>
      )}
    </div>
  );
}
