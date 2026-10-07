import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeatherData } from '../api/weatherApi';
import { reverseGeocode } from '../api/geocodingApi';
import {
  Coordinates,
  WeatherApiResponse,
  ProcessedHourlyItem,
  ProcessedDailyItem,
  LocationInfo,
} from '../types/weather';

export type WeatherLoadState = 'idle' | 'loading' | 'success' | 'error';

export interface WeatherState {
  loadState: WeatherLoadState;
  weatherData: WeatherApiResponse | null;
  hourlyItems: ProcessedHourlyItem[];
  dailyItems: ProcessedDailyItem[];
  locationInfo: LocationInfo | null;
  errorMessage: string | null;
}

// Chuyển đổi dữ liệu hourly thô thành mảng ProcessedHourlyItem
function processHourlyData(data: WeatherApiResponse): ProcessedHourlyItem[] {
  const { time, ...fields } = data.hourly;
  return time.map((t, i) => ({
    time: t,
    timestamp: new Date(t).getTime(),
    temperature: fields.temperature_2m[i] ?? 0,
    apparentTemperature: fields.apparent_temperature[i] ?? 0,
    precipitationProbability: fields.precipitation_probability[i] ?? 0,
    precipitation: fields.precipitation[i] ?? 0,
    weatherCode: fields.weather_code[i] ?? 0,
    humidity: fields.relative_humidity_2m[i] ?? 0,
    windSpeed: fields.wind_speed_10m[i] ?? 0,
    windDirection: fields.wind_direction_10m[i] ?? 0,
    pressure: fields.surface_pressure[i] ?? 0,
    visibility: fields.visibility[i] ?? 0,
    uvIndex: fields.uv_index[i] ?? 0,
  }));
}

// Chuyển đổi dữ liệu daily thô thành mảng ProcessedDailyItem
function processDailyData(data: WeatherApiResponse): ProcessedDailyItem[] {
  const { time, ...fields } = data.daily;
  return time.map((t, i) => ({
    date: t,
    timestamp: new Date(t + 'T00:00:00').getTime(),
    weatherCode: fields.weather_code[i] ?? 0,
    tempMax: fields.temperature_2m_max[i] ?? 0,
    tempMin: fields.temperature_2m_min[i] ?? 0,
    apparentTempMax: fields.apparent_temperature_max[i] ?? 0,
    apparentTempMin: fields.apparent_temperature_min[i] ?? 0,
    precipitationSum: fields.precipitation_sum[i] ?? 0,
    precipitationProbability: fields.precipitation_probability_max[i] ?? 0,
    uvIndexMax: fields.uv_index_max[i] ?? 0,
    windSpeedMax: fields.wind_speed_10m_max[i] ?? 0,
    windDirectionDominant: fields.wind_direction_10m_dominant[i] ?? 0,
    sunrise: fields.sunrise[i] ?? '',
    sunset: fields.sunset[i] ?? '',
  }));
}

// Hook tổng hợp: lấy + xử lý dữ liệu thời tiết khi có tọa độ
export function useWeather(coordinates: Coordinates | null) {
  const [state, setState] = useState<WeatherState>({
    loadState: 'idle',
    weatherData: null,
    hourlyItems: [],
    dailyItems: [],
    locationInfo: null,
    errorMessage: null,
  });

  // Ref lưu AbortController để hủy request khi unmount hoặc tọa độ đổi
  const abortRef = useRef<AbortController | null>(null);

  const loadWeather = useCallback(async (coords: Coordinates) => {
    // Hủy request cũ nếu đang chạy
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState(prev => ({
      ...prev,
      loadState: 'loading',
      errorMessage: null,
    }));

    try {
      // Gọi song song: thời tiết + tên địa điểm
      const [weatherData, locationInfo] = await Promise.all([
        fetchWeatherData(coords.latitude, coords.longitude, controller.signal),
        reverseGeocode(coords.latitude, coords.longitude),
      ]);

      if (controller.signal.aborted) return;

      const hourlyItems = processHourlyData(weatherData);
      const dailyItems = processDailyData(weatherData);

      setState({
        loadState: 'success',
        weatherData,
        hourlyItems,
        dailyItems,
        locationInfo,
        errorMessage: null,
      });
    } catch (error: any) {
      if (controller.signal.aborted) return;

      let errorMessage = 'Có lỗi xảy ra khi tải dữ liệu thời tiết';
      if (error.message?.includes('Network') || error.message?.includes('fetch')) {
        errorMessage = 'Mất kết nối mạng. Vui lòng kiểm tra internet và thử lại.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        loadState: 'error',
        errorMessage,
      }));
    }
  }, []);

  // Tự động tải khi tọa độ thay đổi
  useEffect(() => {
    if (coordinates) {
      loadWeather(coordinates);
    }

    // Cleanup: hủy request khi unmount
    return () => {
      abortRef.current?.abort();
    };
  }, [coordinates, loadWeather]);

  // Hàm refresh thủ công
  const refresh = useCallback(() => {
    if (coordinates) loadWeather(coordinates);
  }, [coordinates, loadWeather]);

  return { ...state, refresh };
}
