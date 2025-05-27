import React, { useState, useEffect, useRef } from 'react';
import './HeatSlider.css';

interface HeatSliderProps {
  onHeatChange: (heat: number) => void;
  initialHeat?: number;
}

const TICK_COUNT = 11; // 0, 10, ..., 100
const MAJOR_TICKS = [0, 50, 100];

// Helper to interpolate between two colors
function interpolateColor(color1: number[], color2: number[], t: number) {
  return color1.map((c, i) => Math.round(c + (color2[i] - c) * t));
}

// Get the color for a given heat value (0-100)
function getHeatColor(heat: number) {
  // Blue: [0, 86, 179], Yellow: [240, 180, 0], Red: [169, 30, 44]
  if (heat <= 50) {
    // Blue to Yellow
    const t = heat / 50;
    const rgb = interpolateColor([0, 86, 179], [240, 180, 0], t);
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  } else {
    // Yellow to Red
    const t = (heat - 50) / 50;
    const rgb = interpolateColor([240, 180, 0], [169, 30, 44], t);
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }
}

const HeatSlider: React.FC<HeatSliderProps> = ({ onHeatChange, initialHeat = 50 }) => {
  const [heat, setHeat] = useState(initialHeat);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const trackGroupRef = useRef<HTMLDivElement>(null);

  const getHeatZone = (value: number): 'low' | 'medium' | 'high' => {
    if (value <= 30) return 'low';
    if (value <= 70) return 'medium';
    return 'high';
  };

  const getZoneDescription = (zone: 'low' | 'medium' | 'high'): string => {
    switch (zone) {
      case 'low':
        return 'Rabbit Hole Mode - Deep expertise development';
      case 'medium':
        return 'Balanced Mode - Contextual diffusion with deep dives';
      case 'high':
        return 'Diffusion Mode - Maximum variety, rapid topic switching';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setHeat(newValue);
    onHeatChange(newValue);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Position the floating label exactly above the knob
  useEffect(() => {
    if (!sliderRef.current || !labelRef.current || !trackGroupRef.current) return;
    const slider = sliderRef.current;
    const label = labelRef.current;
    const track = trackGroupRef.current;
    const min = Number(slider.min);
    const max = Number(slider.max);
    const percent = (heat - min) / (max - min);
    const thumbWidth = 44; // match CSS
    const usableWidth = track.offsetWidth - thumbWidth;
    const left = percent * usableWidth + thumbWidth / 2;
    label.style.left = `${left}px`;
  }, [heat]);

  const currentZone = getHeatZone(heat);
  const progressColor = getHeatColor(heat);

  // Graduation ticks
  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => i * 10);

  return (
    <div className="heat-slider-container">
      <label className="visually-hidden" htmlFor="heat-slider">Exploration Heat</label>
      <div className="heat-slider-header">
        <h3>Exploration Heat</h3>
      </div>
      <div className="heat-slider-wrapper">
        <div ref={trackGroupRef} className="slider-track-group">
          <div className={`slider-track-bg-thin`}></div>
          <div
            className="slider-track-progress-thin"
            style={{ width: `${heat}%`, background: progressColor }}
          ></div>
          <input
            id="heat-slider"
            ref={sliderRef}
            type="range"
            min="0"
            max="100"
            value={heat}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className={`heat-slider ${currentZone} ${isDragging ? 'grabbing' : ''}`}
            style={{ cursor: isDragging ? 'grabbing' : undefined }}
          />
          <div ref={labelRef} className={`slider-value-label sqircle ${isDragging ? 'active' : ''}`}>{heat}</div>
        </div>
        <div className="slider-ticks">
          {ticks.map((tick, i) => (
            <div
              key={i}
              className={`slider-tick${MAJOR_TICKS.includes(tick) ? ' major' : ''}`}
              style={{ left: `${(tick / 100) * 100}%` }}
            />
          ))}
        </div>
        <div className="slider-zones-labels">
          <span className="slider-zone-label left">Low</span>
          <span className="slider-zone-label center">Medium</span>
          <span className="slider-zone-label right">High</span>
        </div>
      </div>
      <div className="heat-description centered">
        <div className={`zone-indicator ${currentZone}`} style={{justifyContent: 'center'}}>
          <span>{getZoneDescription(currentZone)}</span>
        </div>
      </div>
    </div>
  );
};

export default HeatSlider; 