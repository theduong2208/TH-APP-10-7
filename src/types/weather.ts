// Kiểu dữ liệu cho toàn bộ ứng dụng thời tiết

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  city: string;
  region: string;
  displayName: string;
}

// Dữ liệu thời tiết hiện tại từ Open-Meteo
export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  is_day: number; // 0 = đêm, 1 = ngày
}

// Dữ liệu theo giờ
export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  surface_pressure: number[];
  visibility: number[];
  uv_index: number[];
}

// Dữ liệu theo ngày
export interface DailyWeather {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  uv_index_max: number[];
  wind_speed_10m_max: number[];
  wind_direction_10m_dominant: number[];
  sunrise: string[];
  sunset: string[];
}

// Response đầy đủ từ API Open-Meteo
export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
}

// Dữ liệu đã được xử lý cho 1 giờ cụ thể
export interface ProcessedHourlyItem {
  time: string;
  timestamp: number;
  temperature: number;
  apparentTemperature: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
}

// Dữ liệu đã được xử lý cho 1 ngày
export interface ProcessedDailyItem {
  date: string;
  timestamp: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirectionDominant: number;
  sunrise: string;
  sunset: string;
}

// Kết quả tìm kiếm địa điểm
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // tỉnh/bang
}

// Thông tin WMO weather code
export interface WeatherCodeInfo {
  descriptionVi: string;
  iconName: string; // tên icon MaterialCommunityIcons
  gradientDay: string[];
  gradientNight: string[];
}

// Navigation params
export type RootStackParamList = {
  Home: undefined;
  Detail: {
    type: 'hourly' | 'daily';
    hourlyItem?: ProcessedHourlyItem;
    dailyItem?: ProcessedDailyItem;
    locationName?: string;
  };
  Search: undefined;
  Permission: undefined;
};
