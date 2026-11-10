/**
 * weatherCodes.js
 * ----------------
 * World Meteorological Organization (WMO) Weather interpretation codes.
 * Open-Meteo uses these standard numeric codes.
 * This helper returns a human-friendly description and a crisp inline SVG icon.
 */

// Reusable SVG snippets with color styling
const ICONS = {
  sun: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`,

  partlyCloudy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="M20 12h2"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
      <path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"></path>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
    </svg>`,

  cloudy: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
    </svg>`,

  fog: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 14h16"></path>
      <path d="M4 18h16"></path>
      <path d="M7 10h10"></path>
      <path d="M9 6h6"></path>
    </svg>`,

  drizzle: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      <line x1="8" y1="19" x2="8" y2="21"></line>
      <line x1="12" y1="19" x2="12" y2="21"></line>
      <line x1="16" y1="19" x2="16" y2="21"></line>
    </svg>`,

  rain: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.5 17H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      <line x1="8" y1="19" x2="6" y2="23"></line>
      <line x1="12" y1="19" x2="10" y2="23"></line>
      <line x1="16" y1="19" x2="14" y2="23"></line>
    </svg>`,

  snow: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.5 17H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      <line x1="8" y1="19" x2="8" y2="21"></line>
      <line x1="7" y1="20" x2="9" y2="20"></line>
      <line x1="12" y1="19" x2="12" y2="21"></line>
      <line x1="11" y1="20" x2="13" y2="20"></line>
      <line x1="16" y1="19" x2="16" y2="21"></line>
      <line x1="15" y1="20" x2="17" y2="20"></line>
    </svg>`,

  thunderstorm: `
    <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.5 17H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"></path>
      <polyline points="13 15 10 20 14 20 11 24"></polyline>
    </svg>`
};

// Complete WMO Code Map
export const WEATHER_CODES = {
  0: { description: 'Clear Sky', icon: ICONS.sun },
  1: { description: 'Mainly Clear', icon: ICONS.partlyCloudy },
  2: { description: 'Partly Cloudy', icon: ICONS.partlyCloudy },
  3: { description: 'Overcast', icon: ICONS.cloudy },
  45: { description: 'Foggy', icon: ICONS.fog },
  48: { description: 'Depositing Rime Fog', icon: ICONS.fog },
  51: { description: 'Light Drizzle', icon: ICONS.drizzle },
  53: { description: 'Moderate Drizzle', icon: ICONS.drizzle },
  55: { description: 'Dense Drizzle', icon: ICONS.drizzle },
  56: { description: 'Light Freezing Drizzle', icon: ICONS.drizzle },
  57: { description: 'Dense Freezing Drizzle', icon: ICONS.drizzle },
  61: { description: 'Slight Rain', icon: ICONS.rain },
  63: { description: 'Moderate Rain', icon: ICONS.rain },
  65: { description: 'Heavy Rain', icon: ICONS.rain },
  66: { description: 'Light Freezing Rain', icon: ICONS.rain },
  67: { description: 'Heavy Freezing Rain', icon: ICONS.rain },
  71: { description: 'Slight Snow Fall', icon: ICONS.snow },
  73: { description: 'Moderate Snow Fall', icon: ICONS.snow },
  75: { description: 'Heavy Snow Fall', icon: ICONS.snow },
  77: { description: 'Snow Grains', icon: ICONS.snow },
  80: { description: 'Slight Rain Showers', icon: ICONS.rain },
  81: { description: 'Moderate Rain Showers', icon: ICONS.rain },
  82: { description: 'Violent Rain Showers', icon: ICONS.rain },
  85: { description: 'Slight Snow Showers', icon: ICONS.snow },
  86: { description: 'Heavy Snow Showers', icon: ICONS.snow },
  95: { description: 'Thunderstorm', icon: ICONS.thunderstorm },
  96: { description: 'Thunderstorm with Slight Hail', icon: ICONS.thunderstorm },
  99: { description: 'Thunderstorm with Heavy Hail', icon: ICONS.thunderstorm }
};

/**
 * Returns weather description and SVG icon for a given WMO code.
 * @param {number} code - WMO code from Open-Meteo
 * @returns {{ description: string, icon: string }}
 */
export function getWeatherDetails(code) {
  if (WEATHER_CODES.hasOwnProperty(code)) {
    return WEATHER_CODES[code];
  }
  return {
    description: 'Variable Conditions',
    icon: ICONS.partlyCloudy
  };
}
