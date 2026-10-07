import { GeocodingResult, LocationInfo } from '../types/weather';

const TIMEOUT_MS = 10000;

// Reverse geocoding: tọa độ -> tên địa điểm (không cần API key)
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationInfo> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error('Không thể lấy tên địa điểm');
    }

    const data = await response.json();

    // Xây dựng tên hiển thị từ dữ liệu trả về
    const city = data.city || data.locality || data.localityInfo?.administrative?.[4]?.name || '';
    const region = data.principalSubdivision || data.countryName || '';
    const displayName = city
      ? `${city}${region ? `, ${region}` : ''}`
      : `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;

    return { city, region, displayName };
  } catch (error: any) {
    // Fallback: hiển thị tọa độ nếu reverse geocoding thất bại
    console.warn('Reverse geocoding thất bại:', error.message);
    return {
      city: '',
      region: '',
      displayName: `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// Tìm kiếm thành phố theo tên (dùng Open-Meteo Geocoding API)
export async function searchCity(
  query: string,
  signal?: AbortSignal,
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const mergedSignal = signal ?? controller.signal;

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=vi`;
    const response = await fetch(url, { signal: mergedSignal });

    if (!response.ok) {
      throw new Error('Không thể tìm kiếm thành phố');
    }

    const data = await response.json();
    // API trả về { results: [...] } hoặc {} nếu không tìm thấy
    return (data.results as GeocodingResult[]) ?? [];
  } catch (error: any) {
    if (error.name === 'AbortError') return [];
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
