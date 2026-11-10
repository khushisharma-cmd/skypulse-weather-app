/**
 * ui.js
 * -----
 * View module responsible for updating the User Interface (DOM).
 * All queries to document elements and HTML rendering logic live here.
 */

import { getWeatherDetails } from './weatherCodes.js';

// Cache frequently accessed DOM elements for performance
const elements = {
  statusMessage: document.getElementById('status-message'),
  loadingOverlay: document.getElementById('loading-overlay'),
  cityName: document.getElementById('city-name'),
  currentDate: document.getElementById('current-date'),
  timezoneBadge: document.getElementById('timezone-badge'),
  currentTemp: document.getElementById('current-temp'),
  currentWeatherIcon: document.getElementById('current-weather-icon'),
  weatherDesc: document.getElementById('weather-desc'),
  todayHigh: document.getElementById('today-high'),
  todayLow: document.getElementById('today-low'),
  feelsLike: document.getElementById('feels-like'),
  humidityValue: document.getElementById('humidity-value'),
  humidityLevel: document.getElementById('humidity-level'),
  windValue: document.getElementById('wind-value'),
  windLevel: document.getElementById('wind-level'),
  forecastContainer: document.getElementById('forecast-container')
};

/**
 * Format a date string into a friendly, human-readable format.
 * E.g. "Tuesday, 10 Nov 2026"
 * 
 * @param {string} dateString - ISO date string (e.g. "2026-11-10")
 * @returns {string} Formatted date
 */
function formatHeroDate(dateString) {
  // Safe date parsing to avoid UTC-midnight timezone shifting
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Format forecast day and date.
 * E.g. { dayName: "Wed", dateStr: "11 Nov" }
 * 
 * @param {string} dateString - ISO date string
 * @param {number} index - Index in forecast list
 * @returns {{ dayName: string, dateStr: string }}
 */
function formatForecastDate(dateString, index) {
  // Safe date parsing to avoid UTC-midnight timezone shifting
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const dayName = index === 0 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
  const dateStr = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  return { dayName, dateStr };
}

/**
 * Provides an intuitive label for humidity levels.
 * @param {number} humidity - Relative humidity percentage
 * @returns {string} Friendly label
 */
function getHumidityDescription(humidity) {
  if (humidity < 30) return 'Dry air';
  if (humidity <= 60) return 'Comfortable';
  return 'High humidity';
}

/**
 * Provides a Beaufort-inspired label for wind speed (in km/h).
 * @param {number} speed - Wind speed in km/h
 * @returns {string} Friendly label
 */
function getWindDescription(speed) {
  if (speed < 5) return 'Calm';
  if (speed < 20) return 'Gentle breeze';
  if (speed < 39) return 'Moderate breeze';
  if (speed < 62) return 'Strong breeze';
  return 'Gale warning';
}

export const UI = {
  /**
   * Display a spinner over the dashboard while data is being fetched.
   */
  showLoading() {
    elements.loadingOverlay.classList.remove('hidden');
    this.clearStatus();
  },

  /**
   * Hide the loading spinner.
   */
  hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
  },

  /**
   * Display an error alert message to the user.
   * @param {string} message - Error text to display
   */
  showError(message) {
    elements.statusMessage.className = 'status-message error';
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.remove('hidden');
  },

  /**
   * Display an informational or success message.
   * @param {string} message - Message text
   */
  showInfo(message) {
    elements.statusMessage.className = 'status-message info';
    elements.statusMessage.textContent = message;
    elements.statusMessage.classList.remove('hidden');
  },

  /**
   * Hide any visible status alerts.
   */
  clearStatus() {
    elements.statusMessage.classList.add('hidden');
    elements.statusMessage.textContent = '';
  },

  /**
   * Render current weather information and highlights onto the dashboard.
   * 
   * @param {Object} location - Location object { name, country, admin1, timezone }
   * @param {Object} weather - Cleaned weather object from api.js
   */
  renderCurrentWeather(location, weather) {
    const { current, daily } = weather;
    const condition = getWeatherDetails(current.weatherCode);

    // 1. City & Date Header
    const locationDisplayName = location.country 
      ? `${location.name}, ${location.country}` 
      : location.name;

    elements.cityName.textContent = locationDisplayName;
    elements.currentDate.textContent = formatHeroDate(current.time);
    elements.timezoneBadge.textContent = weather.timezoneAbbr || location.timezone || 'UTC';

    // 2. Primary Temperature & Condition
    elements.currentTemp.textContent = current.temperature;
    elements.currentWeatherIcon.innerHTML = condition.icon;
    elements.weatherDesc.textContent = condition.description;

    // 3. Daily Min/Max & Feels Like
    // daily.temperatureMax[0] represents today's forecast high
    elements.todayHigh.textContent = `${daily.temperatureMax[0]}°C`;
    elements.todayLow.textContent = `${daily.temperatureMin[0]}°C`;
    elements.feelsLike.textContent = `${current.feelsLike}°C`;

    // 4. Highlights: Humidity & Wind
    elements.humidityValue.textContent = current.humidity;
    elements.humidityLevel.textContent = getHumidityDescription(current.humidity);

    elements.windValue.textContent = current.windSpeed;
    elements.windLevel.textContent = getWindDescription(current.windSpeed);
  },

  /**
   * Render the 5-day forecast cards.
   * Open-Meteo returns today as daily[0], so we take the upcoming 5 days (indices 1 to 5).
   * 
   * @param {Object} daily - Daily forecast arrays from Open-Meteo
   */
  renderForecast(daily) {
    elements.forecastContainer.innerHTML = '';

    // Take the next 5 days (from tomorrow onwards)
    const upcomingDays = daily.time.slice(1, 6);

    upcomingDays.forEach((dateString, i) => {
      // Offset by 1 because daily[0] was today
      const dailyIndex = i + 1;
      const weatherCode = daily.weatherCode[dailyIndex];
      const maxTemp = daily.temperatureMax[dailyIndex];
      const minTemp = daily.temperatureMin[dailyIndex];

      const condition = getWeatherDetails(weatherCode);
      const { dayName, dateStr } = formatForecastDate(dateString, i);

      // Create card element
      const card = document.createElement('div');
      card.className = 'forecast-card';
      card.innerHTML = `
        <div class="forecast-day">${dayName}</div>
        <div class="forecast-date">${dateStr}</div>
        <div class="forecast-icon" title="${condition.description}">
          ${condition.icon}
        </div>
        <div class="forecast-temps">
          <span class="temp-max">${maxTemp}°</span>
          <span class="temp-min">${minTemp}°</span>
        </div>
        <div class="forecast-condition-name">${condition.description}</div>
      `;

      elements.forecastContainer.appendChild(card);
    });
  }
};
