// Các hàm định dạng dữ liệu hiển thị

// Làm tròn nhiệt độ
export function formatTemp(temp: number): string {
  return `${Math.round(temp)}°`;
}

// Định dạng giờ từ ISO string "2024-01-01T14:00"
export function formatHour(timeStr: string): string {
  const hour = parseInt(timeStr.split('T')[1]?.split(':')[0] ?? '0', 10);
  return `${hour.toString().padStart(2, '0')}:00`;
}

// Định dạng ngày thứ trong tuần từ ISO date string "2024-01-15"
export function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const dayIndex = date.getDay(); // 0 = Chủ nhật
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return days[dayIndex] ?? 'T2';
}

// Định dạng ngày đầy đủ (Hôm nay / Ngày mai / Thứ X, ngày Y)
export function formatFullDay(dateStr: string, index: number): string {
  if (index === 0) return 'Hôm nay';
  if (index === 1) return 'Ngày mai';
  const date = new Date(dateStr + 'T00:00:00');
  const dayIndex = date.getDay();
  const days = [
    'Chủ nhật',
    'Thứ hai',
    'Thứ ba',
    'Thứ tư',
    'Thứ năm',
    'Thứ sáu',
    'Thứ bảy',
  ];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${days[dayIndex]}, ${day}/${month}`;
}

// Định dạng ngắn (Thứ X)
export function formatShortDay(dateStr: string, index: number): string {
  if (index === 0) return 'Hôm nay';
  return formatDayOfWeek(dateStr);
}

// Định dạng tốc độ gió
export function formatWindSpeed(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

// Định dạng áp suất
export function formatPressure(pressure: number): string {
  return `${Math.round(pressure)} hPa`;
}

// Định dạng tầm nhìn (từ mét về km)
export function formatVisibility(visibilityMeters: number): string {
  const km = visibilityMeters / 1000;
  if (km >= 10) return `${Math.round(km)} km`;
  return `${km.toFixed(1)} km`;
}

// Định dạng lượng mưa
export function formatPrecipitation(mm: number): string {
  if (mm < 0.1) return '0 mm';
  return `${mm.toFixed(1)} mm`;
}

// Định dạng độ ẩm
export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

// Định dạng xác suất mưa
export function formatRainProb(prob: number): string {
  return `${Math.round(prob)}%`;
}

// Định dạng thời gian mặt trời mọc/lặn (từ ISO "2024-01-01T05:30" -> "05:30")
export function formatSunTime(timeStr: string): string {
  const timePart = timeStr.split('T')[1];
  if (!timePart) return '--:--';
  return timePart.substring(0, 5);
}

// Kiểm tra thời điểm hiện tại là giờ nào (để highlight trong danh sách giờ)
export function isCurrentHour(timeStr: string): boolean {
  const now = new Date();
  const itemDate = new Date(timeStr);
  return (
    now.getFullYear() === itemDate.getFullYear() &&
    now.getMonth() === itemDate.getMonth() &&
    now.getDate() === itemDate.getDate() &&
    now.getHours() === itemDate.getHours()
  );
}

// Lấy chỉ số giờ hiện tại trong mảng hourly.time
export function getCurrentHourIndex(times: string[]): number {
  const now = new Date();
  return times.findIndex(t => isCurrentHour(t));
}
