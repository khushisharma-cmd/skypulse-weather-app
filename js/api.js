/**
 * api.js
 * ------
 * Service module responsible for network requests to Open-Meteo.
 * 
 * Open-Meteo requires two separate API calls:
 * 1. Geocoding API: Converts a human city name (e.g., "Delhi") into geographic coordinates (Latitude, Longitude).
 * 2. Forecast API: Uses those coordinates to fetch current conditions and a 5-day daily forecast.
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Step 1: Search for a city by name and retrieve its geographic coordinates.
 * 
 * @param {string} cityName - The name of the city entered by the user
 * @returns {Promise<Object>} Object containing latitude, longitude, city name, and country
 * @throws {Error} If city is not found or if network request fails
 */
export async function searchCity(cityName) {
  const sanitizedCity = cityName.trim();

  if (!sanitizedCity) {
    throw new Error('Please enter a city name.');
  }

  // Construct URL with query parameters
  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(sanitizedCity)}&count=1&language=en&format=json`;

  try {
    const response = await fetch(url);

    // Check for HTTP errors (e.g., 500, 404)
    if (!response.ok) {
      throw new Error(`Geocoding server error: HTTP ${response.status}`);
    }

    const data = await response.json();

    // Check if any results matched the search term
    if (!data.results || data.results.length === 0) {
      throw new Error(`City "${cityName}" not found. Please check the spelling and try again.`);
    }

    const firstResult = data.results[0];

    return {
      name: firstResult.name,
      country: firstResult.country || '',
      admin1: firstResult.admin1 || '',
      latitude: firstResult.latitude,
      longitude: firstResult.longitude,
      timezone: firstResult.timezone || 'auto'
    };
  } catch (error) {
    // If the error is network-related (e.g. offline)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach Open-Meteo. Please check your internet connection.');
    }
    // Re-throw our custom descriptive error message
    throw error;
  }
}

/**
 * Step 2: Fetch current weather and 5-day daily forecast for given coordinates.
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @param {string} [timezone='auto'] - Timezone identifier (e.g., 'Asia/Kolkata')
 * @returns {Promise<Object>} Formatted current and daily forecast data
 * @throws {Error} If network request fails or server returns an error
 */
export async function fetchWeather(latitude, longitude, timezone = 'auto') {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('Latitude and Longitude are required to fetch weather data.');
  }

  // Request current parameters + daily 7-day parameters (we will use the first 5 days)
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: timezone
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather forecast server error: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Incomplete weather data received from Open-Meteo.');
    }

    // Clean and normalize the data structure for easy consumption by our UI layer
    return {
      timezone: data.timezone,
      timezoneAbbr: data.timezone_abbreviation,
      current: {
        time: data.current.time,
        temperature: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        weatherCode: data.current.weather_code
      },
      daily: {
        time: data.daily.time,
        weatherCode: data.daily.weather_code,
        temperatureMax: data.daily.temperature_2m_max.map(temp => Math.round(temp)),
        temperatureMin: data.daily.temperature_2m_min.map(temp => Math.round(temp))
      }
    };
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to reach Open-Meteo. Please check your internet connection.');
    }
    throw error;
  }
}
