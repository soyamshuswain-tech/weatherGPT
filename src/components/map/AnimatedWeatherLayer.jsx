import React, { useMemo } from 'react';
import { SVGOverlay } from 'react-leaflet';
import L from 'leaflet';
import RainEffect from './RainEffect';
import LightningEffect from './LightningEffect';
import CycloneEffect from './CycloneEffect';
import FloodEffect from './FloodEffect';
import '../../styles/weatherAnimations.css';

export default function AnimatedWeatherLayer({ type, center, radius, intensity = 'moderate', active = false }) {
  const bounds = useMemo(() => {
    if (!center) return null;
    // toBounds takes the total diameter (size) in meters. 
    // To match a Leaflet Circle with `radius`, we must pass `radius * 2`.
    return L.latLng(center[0], center[1]).toBounds(radius * 2);
  }, [center, radius]);

  if (!active || !bounds) return null;

  // Generate a unique ID for the clip path so multiple layers don't conflict
  const clipId = `circle-mask-${type}-${center[0]}-${center[1]}`.replace(/[\.\-]/g, '');

  return (
    <SVGOverlay bounds={bounds}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        
        {/* We use a group with the clipPath applied. 
            Inside, a foreignObject allows standard HTML/CSS animations to be rendered 
            perfectly masked to the geographic bounding circle. */}
        <g clipPath={`url(#${clipId})`}>
          {type === 'rain' && <RainEffect intensity={intensity} />}
          
          {type !== 'rain' && (
            <foreignObject x="0" y="0" width="100" height="100">
              <div xmlns="http://www.w3.org/1999/xhtml" className="weather-effect-container">
                {type === 'lightning' && <LightningEffect intensity={intensity} />}
                {type === 'cyclone' && <CycloneEffect intensity={intensity} />}
                {type === 'flood' && <FloodEffect intensity={intensity} />}
              </div>
            </foreignObject>
          )}
        </g>
      </svg>
    </SVGOverlay>
  );
}
