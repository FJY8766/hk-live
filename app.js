import { formatTemp, formatAqhi, nextTrain } from './format.js';

const WEATHER_URL =
  'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en';
const FETCH_ERROR_MESSAGE = 'Weather unavailable — check your connection.';
const MISSING_STATION_MESSAGE = 'Hong Kong Observatory reading not in this update.';

function weatherContent() {
  return document.getElementById('weather-content');
}

function showWeatherMessage(message) {
  const container = weatherContent();
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = 'weather-error';
  p.textContent = message;
  container.appendChild(p);
}

function renderWeather(text) {
  const container = weatherContent();
  container.replaceChildren();
  const lines = text.split('\n');

  const station = document.createElement('p');
  station.className = 'weather-station';
  station.textContent = lines[0];

  const temperature = document.createElement('p');
  temperature.className = 'weather-temp';
  temperature.textContent = lines[1];

  const updated = document.createElement('p');
  updated.className = 'weather-updated';
  updated.textContent = lines[2];

  container.append(station, temperature, updated);
}

async function loadWeather() {
  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) {
      throw new Error('Weather request failed');
    }
    const data = await response.json();
    const text = formatTemp(data);
    if (!text) {
      showWeatherMessage(MISSING_STATION_MESSAGE);
      return;
    }
    renderWeather(text);
  } catch (error) {
    showWeatherMessage(FETCH_ERROR_MESSAGE);
  }
}

loadWeather();

const AQHI_URL = 'https://dashboard.data.gov.hk/api/aqhi-individual?format=json';
const AIR_FETCH_ERROR_MESSAGE = 'Air quality unavailable — check your connection.';
const AIR_MISSING_STATION_MESSAGE = 'Central/Western reading not in this update.';

function airContent() {
  return document.getElementById('air-content');
}

function showAirMessage(message) {
  const container = airContent();
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = 'air-error';
  p.textContent = message;
  container.appendChild(p);
}

function renderAirQuality(text) {
  const container = airContent();
  container.replaceChildren();
  const lines = text.split('\n');

  const station = document.createElement('p');
  station.className = 'air-station';
  station.textContent = lines[0];

  const aqhi = document.createElement('p');
  aqhi.className = 'air-aqhi';
  aqhi.textContent = lines[1];

  const risk = document.createElement('p');
  risk.className = 'air-risk';
  risk.textContent = lines[2];

  container.append(station, aqhi, risk);
}

async function loadAirQuality() {
  try {
    const response = await fetch(AQHI_URL);
    if (!response.ok) {
      throw new Error('Air quality request failed');
    }
    const data = await response.json();
    const text = formatAqhi(data);
    if (!text) {
      showAirMessage(AIR_MISSING_STATION_MESSAGE);
      return;
    }
    renderAirQuality(text);
  } catch (error) {
    showAirMessage(AIR_FETCH_ERROR_MESSAGE);
  }
}

loadAirQuality();

const TRANSPORT_URL =
  'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php?line=ISL&sta=HKU';
const TRANSPORT_FETCH_ERROR_MESSAGE = 'Transport unavailable — check your connection.';
const TRANSPORT_MISSING_MESSAGE = 'HKU train times not in this update.';

function transportContent() {
  return document.getElementById('transport-content');
}

function showTransportMessage(message) {
  const container = transportContent();
  container.replaceChildren();
  const p = document.createElement('p');
  p.className = 'transport-error';
  p.textContent = message;
  container.appendChild(p);
}

function renderTransport(text) {
  const container = transportContent();
  container.replaceChildren();
  const lines = text.split('\n');

  const minutesEl = document.createElement('p');
  minutesEl.className = 'transport-minutes';
  minutesEl.textContent = lines[0];

  const destEl = document.createElement('p');
  destEl.className = 'transport-dest';
  destEl.textContent = lines[1];

  container.append(minutesEl, destEl);
}

async function loadTransport() {
  try {
    const response = await fetch(TRANSPORT_URL);
    if (!response.ok) {
      throw new Error('Transport request failed');
    }
    const data = await response.json();
    const text = nextTrain(data);
    if (!text) {
      showTransportMessage(TRANSPORT_MISSING_MESSAGE);
      return;
    }
    renderTransport(text);
  } catch (error) {
    showTransportMessage(TRANSPORT_FETCH_ERROR_MESSAGE);
  }
}

loadTransport();
