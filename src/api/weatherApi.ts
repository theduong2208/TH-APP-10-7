import { WeatherApiResponse } from '../types/weather';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const TIMEOUT_MS = 15000;

// Lấy dữ liệu thời tiết từ Open-Meteo theo tọa độ
export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'is_day',
    ].join(','),
    hourly: [
      'temperature_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'relative_humidity_2m',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'visibility',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'uv_index_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
      'sunrise',
      'sunset',
    ].join(','),
    timezone: 'auto',
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });

  // Thêm timeout cho request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const mergedSignal = signal ?? controller.signal;

  try {
    const response = await fetch(`${BASE_URL}?${params.toString()}`, {
      signal: mergedSignal,
    });

    if (!response.ok) {
      throw new Error(`API lỗi: ${response.status} ${response.statusText}`);
    }

    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Yêu cầu bị hủy hoặc hết thời gian chờ');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
