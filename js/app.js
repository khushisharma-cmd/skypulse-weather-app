/**
 * app.js
 * ------
 * Application Controller.
 * Connects the API service layer (api.js) with the UI rendering layer (ui.js).
 * Listens for user interactions (form submit, Enter key, location click).
 */

import { searchCity, fetchWeather } from './api.js';
import { UI } from './ui.js';

// Initial default city
const DEFAULT_CITY = 'Delhi';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const geoBtn = document.getElementById('geo-btn');

/**
 * Main Controller Function:
 * Fetches and displays weather data for a given city name.
 * 
 * Flow:
 * 1. Shows loading indicator.
 * 2. Calls Geocoding API to resolve city -> { latitude, longitude }.
 * 3. Calls Forecast API with coordinates -> weather dataset.
 * 4. Calls UI module to render current conditions & 5-day forecast.
 * 5. Catches any errors and displays user-friendly alerts.
 * 
 * @param {string} cityName - Name of the city to search for
 */
async function loadWeatherForCity(cityName) {
  try {
    // 1. Show loading state to provide visual feedback
    UI.showLoading();

    // 2. Fetch coordinates from Open-Meteo Geocoding API
    const location = await searchCity(cityName);

    // 3. Fetch weather metrics from Open-Meteo Forecast API
    const weather = await fetchWeather(location.latitude, location.longitude, location.timezone);

    // 4. Update the Dashboard UI
    UI.renderCurrentWeather(location, weather);
    UI.renderForecast(weather.daily);

    // 5. Clear input and remove focus
    cityInput.value = '';
    cityInput.blur();
  } catch (error) {
    console.error('Weather load error:', error);
    // Display descriptive error banner (e.g. "City not found", "Network error")
    UI.showError(error.message || 'An unexpected error occurred. Please try again.');
  } finally {
    // Hide the loading spinner regardless of success or failure
    UI.hideLoading();
  }
}

/**
 * Geolocation Handler:
 * Uses the browser's built-in GPS API (navigator.geolocation) to fetch
 * weather for the user's physical location.
 */
function handleGeolocation() {
  if (!navigator.geolocation) {
    UI.showError('Geolocation is not supported by your browser.');
    return;
  }

  UI.showLoading();

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const weather = await fetchWeather(latitude, longitude);

        // Friendly label for user's GPS coordinates
        const location = {
          name: 'Current Location',
          country: weather.timezone ? weather.timezone.replace('_', ' ') : '',
          latitude,
          longitude,
          timezone: weather.timezone
        };

        UI.renderCurrentWeather(location, weather);
        UI.renderForecast(weather.daily);
        cityInput.value = '';
      } catch (error) {
        UI.showError(error.message || 'Could not fetch weather for your location.');
      } finally {
        UI.hideLoading();
      }
    },
    (geoError) => {
      UI.hideLoading();
      let message = 'Unable to retrieve your location.';
      if (geoError.code === geoError.PERMISSION_DENIED) {
        message = 'Location access was denied. You can still search for any city manually.';
      } else if (geoError.code === geoError.TIMEOUT) {
        message = 'Location request timed out. Please try searching for your city.';
      }
      UI.showError(message);
    },
    { timeout: 10000 }
  );
}

// ============================================================================
// Event Listeners
// ============================================================================

/**
 * Form submit listener:
 * Handles both clicking the "Search" button and pressing the "Enter" key
 * inside the input field automatically.
 */
searchForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevents full page reload
  const query = cityInput.value.trim();

  if (query) {
    loadWeatherForCity(query);
  } else {
    UI.showError('Please enter a city name.');
  }
});

/**
 * Location button listener:
 * Triggers the browser's native location prompt.
 */
if (geoBtn) {
  geoBtn.addEventListener('click', handleGeolocation);
}

/**
 * App initialization:
 * Automatically loads Delhi's weather when the webpage finishes loading.
 */
document.addEventListener('DOMContentLoaded', () => {
  loadWeatherForCity(DEFAULT_CITY);
});
