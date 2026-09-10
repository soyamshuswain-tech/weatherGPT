import React from 'react';
import '../styles/weather3D.css';

export default function Animated3DWeatherIcon({ condition }) {
  const cond = (condition || '').toLowerCase();
  
  const isSunny = cond.includes('sun') || cond.includes('clear');
  const isCloudy = cond.includes('cloud') || cond.includes('overcast');
  const isRainy = cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower');
  const isThunder = cond.includes('thunder') || cond.includes('storm') || cond.includes('lightning');
  const isSnow = cond.includes('snow');
  const isAtmosphere = cond.includes('mist') || cond.includes('fog') || cond.includes('haze') || cond.includes('smoke') || cond.includes('dust');

  const currentHour = new Date().getHours();
  const isNight = currentHour < 6 || currentHour >= 18;

  return (
    <div className="weather-3d-scene">
      <div className="weather-3d-container">
        {/* Celestial Body Element */}
        {(isSunny || (isCloudy && !isRainy && !isThunder)) && (
          isNight ? (
            <div className="moon-3d" style={{ transform: 'translateZ(-30px)' }}></div>
          ) : (
            <div className="sun-3d" style={{ transform: 'translateZ(-30px)' }}>
              <div className="sun-ray" style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'translate(-50%, -50%) rotate(90deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'translate(-50%, -50%) rotate(135deg)' }}></div>
            </div>
          )
        )}

        {/* Cloud Elements */}
        {isCloudy && (
          <>
            <div className={`cloud-3d ${isRainy || isThunder ? 'cloud-dark' : ''}`} style={{ top: '20px', left: '10px', transform: 'translateZ(10px)' }}></div>
            <div className={`cloud-3d ${isRainy || isThunder ? 'cloud-dark' : ''}`} style={{ top: '40px', left: '-10px', transform: 'translateZ(30px) scale(0.8)' }}></div>
          </>
        )}
        
        {/* If it's JUST rainy/thunder (no explicit cloud string but rain string) */}
        {!isCloudy && (isRainy || isThunder || isSnow) && (
          <div className="cloud-3d cloud-dark" style={{ top: '20px', left: '10px', transform: 'translateZ(20px)' }}></div>
        )}

        {/* Rain Elements */}
        {(isRainy || isThunder) && (
          <>
            <div className="rain-drop" style={{ left: '20px', top: '50px', animationDelay: '0s' }}></div>
            <div className="rain-drop" style={{ left: '40px', top: '55px', animationDelay: '0.2s' }}></div>
            <div className="rain-drop" style={{ left: '60px', top: '45px', animationDelay: '0.5s' }}></div>
            <div className="rain-drop" style={{ left: '80px', top: '50px', animationDelay: '0.1s' }}></div>
            <div className="rain-drop" style={{ left: '50px', top: '60px', animationDelay: '0.4s' }}></div>
          </>
        )}

        {/* Lightning Elements */}
        {isThunder && (
          <>
            <div className="lightning-bolt" style={{ left: '40px', top: '50px', transform: 'translateZ(15px)' }}></div>
            <div className="lightning-bolt" style={{ left: '70px', top: '40px', transform: 'translateZ(25px) scale(0.7)', animationDelay: '2s' }}></div>
          </>
        )}
        
        {/* Atmosphere (Mist, Fog, Haze) Elements */}
        {isAtmosphere && !isCloudy && !isRainy && (
          <>
            <div className="cloud-3d" style={{ top: '25px', left: '10px', opacity: 0.75, filter: 'blur(1px)' }}></div>
            <div className="cloud-3d" style={{ top: '45px', left: '-5px', opacity: 0.6, transform: 'scale(0.85)' }}></div>
          </>
        )}

        {/* Default fallback */}
        {!isSunny && !isCloudy && !isRainy && !isThunder && !isSnow && !isAtmosphere && (
           <div className="cloud-3d" style={{ top: '30px', left: '20px', transform: 'translateZ(0px)' }}></div>
        )}
      </div>
    </div>
  );
}
