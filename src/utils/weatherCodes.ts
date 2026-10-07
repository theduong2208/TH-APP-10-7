import { WeatherCodeInfo } from '../types/weather';

// Ánh xạ mã thời tiết WMO -> thông tin hiển thị
// Tham khảo: https://open-meteo.com/en/docs#weathervariables
const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  // Quang đãng
  0: {
    descriptionVi: 'Quang đãng',
    iconName: 'weather-sunny',
    gradientDay: ['#2980B9', '#6DD5FA', '#FFFFFF'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  // Mây thưa
  1: {
    descriptionVi: 'Phần lớn quang đãng',
    iconName: 'weather-partly-cloudy',
    gradientDay: ['#4A90D9', '#7FB3D3', '#B0C4DE'],
    gradientNight: ['#141E30', '#243B55', '#3A5A7A'],
  },
  2: {
    descriptionVi: 'Mây rải rác',
    iconName: 'weather-partly-cloudy',
    gradientDay: ['#3D5A80', '#98C1D9', '#BDD5EA'],
    gradientNight: ['#1a1a2e', '#16213e', '#2d3561'],
  },
  3: {
    descriptionVi: 'Nhiều mây',
    iconName: 'weather-cloudy',
    gradientDay: ['#3D5A80', '#607D8B', '#90A4AE'],
    gradientNight: ['#1a1a2e', '#16213e', '#2d3561'],
  },
  // Sương mù
  45: {
    descriptionVi: 'Sương mù',
    iconName: 'weather-fog',
    gradientDay: ['#8a9ba8', '#BBC8CE', '#D0D8DC'],
    gradientNight: ['#2C3E50', '#4A6274', '#627D8C'],
  },
  48: {
    descriptionVi: 'Sương mù giá',
    iconName: 'weather-fog',
    gradientDay: ['#8a9ba8', '#BBC8CE', '#D0D8DC'],
    gradientNight: ['#2C3E50', '#4A6274', '#627D8C'],
  },
  // Mưa phùn nhẹ
  51: {
    descriptionVi: 'Mưa phùn nhẹ',
    iconName: 'weather-rainy',
    gradientDay: ['#373B44', '#4286f4', '#5B6FA0'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  53: {
    descriptionVi: 'Mưa phùn vừa',
    iconName: 'weather-rainy',
    gradientDay: ['#373B44', '#4286f4', '#5B6FA0'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  55: {
    descriptionVi: 'Mưa phùn dày',
    iconName: 'weather-pouring',
    gradientDay: ['#373B44', '#4286f4', '#5B6FA0'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  // Mưa phùn giá
  56: {
    descriptionVi: 'Mưa phùn giá nhẹ',
    iconName: 'weather-snowy-rainy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  57: {
    descriptionVi: 'Mưa phùn giá dày',
    iconName: 'weather-snowy-rainy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  // Mưa rào
  61: {
    descriptionVi: 'Mưa nhẹ',
    iconName: 'weather-rainy',
    gradientDay: ['#373B44', '#4286f4', '#5B6FA0'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  63: {
    descriptionVi: 'Mưa vừa',
    iconName: 'weather-rainy',
    gradientDay: ['#2C3E50', '#3E5270', '#4286f4'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#2C5364'],
  },
  65: {
    descriptionVi: 'Mưa to',
    iconName: 'weather-pouring',
    gradientDay: ['#1F1C2C', '#373B44', '#4286f4'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#373B44'],
  },
  // Mưa đá / mưa giá
  66: {
    descriptionVi: 'Mưa giá nhẹ',
    iconName: 'weather-snowy-rainy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  67: {
    descriptionVi: 'Mưa giá nặng',
    iconName: 'weather-snowy-rainy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  // Tuyết
  71: {
    descriptionVi: 'Tuyết nhẹ',
    iconName: 'weather-snowy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  73: {
    descriptionVi: 'Tuyết vừa',
    iconName: 'weather-snowy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  75: {
    descriptionVi: 'Tuyết dày',
    iconName: 'weather-snowy-heavy',
    gradientDay: ['#D4E8F1', '#E8F4F8', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  // Hạt tuyết
  77: {
    descriptionVi: 'Hạt tuyết rơi',
    iconName: 'weather-snowy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  // Mưa rào (shower)
  80: {
    descriptionVi: 'Mưa rào nhẹ',
    iconName: 'weather-rainy',
    gradientDay: ['#373B44', '#4286f4', '#5B6FA0'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  81: {
    descriptionVi: 'Mưa rào vừa',
    iconName: 'weather-rainy',
    gradientDay: ['#2C3E50', '#373B44', '#4286f4'],
    gradientNight: ['#0F2027', '#203A43', '#2C5364'],
  },
  82: {
    descriptionVi: 'Mưa rào to',
    iconName: 'weather-pouring',
    gradientDay: ['#1F1C2C', '#373B44', '#4286f4'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#373B44'],
  },
  // Tuyết rào
  85: {
    descriptionVi: 'Tuyết rào nhẹ',
    iconName: 'weather-snowy',
    gradientDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  86: {
    descriptionVi: 'Tuyết rào to',
    iconName: 'weather-snowy-heavy',
    gradientDay: ['#D4E8F1', '#E8F4F8', '#F7F7F7'],
    gradientNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'],
  },
  // Giông bão
  95: {
    descriptionVi: 'Giông bão',
    iconName: 'weather-lightning',
    gradientDay: ['#1F1C2C', '#4A3F6B', '#6B5B95'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#4A3F6B'],
  },
  96: {
    descriptionVi: 'Giông bão kèm mưa đá nhẹ',
    iconName: 'weather-lightning-rainy',
    gradientDay: ['#1F1C2C', '#4A3F6B', '#6B5B95'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#4A3F6B'],
  },
  99: {
    descriptionVi: 'Giông bão kèm mưa đá to',
    iconName: 'weather-lightning-rainy',
    gradientDay: ['#1F1C2C', '#4A3F6B', '#6B5B95'],
    gradientNight: ['#0D0D0D', '#1F1C2C', '#4A3F6B'],
  },
};

// Mặc định nếu không tìm thấy code
const defaultInfo: WeatherCodeInfo = {
  descriptionVi: 'Không rõ',
  iconName: 'weather-cloudy',
  gradientDay: ['#2980B9', '#6DD5FA', '#FFFFFF'],
  gradientNight: ['#0F2027', '#203A43', '#2C5364'],
};

// Lấy thông tin thời tiết theo mã WMO và thời điểm ngày/đêm
export function getWeatherInfo(
  code: number,
  isDay: boolean = true,
): WeatherCodeInfo {
  return weatherCodeMap[code] ?? defaultInfo;
}

// Lấy gradient phù hợp theo mã thời tiết và ngày/đêm
export function getWeatherGradient(code: number, isDay: boolean): string[] {
  const info = getWeatherInfo(code, isDay);
  return isDay ? info.gradientDay : info.gradientNight;
}

// Lấy icon name theo mã thời tiết và ngày/đêm
export function getWeatherIcon(code: number, isDay: boolean): string {
  const info = getWeatherInfo(code, isDay);
  // Ban đêm trời quang thì dùng icon trăng
  if (!isDay && code === 0) return 'weather-night';
  if (!isDay && (code === 1 || code === 2)) return 'weather-night-partly-cloudy';
  return info.iconName;
}

// Lấy mô tả tiếng Việt
export function getWeatherDescription(code: number): string {
  return (weatherCodeMap[code] ?? defaultInfo).descriptionVi;
}

// Lấy nhãn hướng gió theo độ
export function getWindDirectionLabel(degrees: number): string {
  const directions = [
    'Bắc', 'Đông Bắc', 'Đông', 'Đông Nam',
    'Nam', 'Tây Nam', 'Tây', 'Tây Bắc',
  ];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// Lấy mức độ và màu UV
export function getUVLevel(uvIndex: number): {
  label: string;
  color: string;
  advice: string;
} {
  if (uvIndex <= 2) {
    return {
      label: 'Thấp',
      color: '#4CAF50',
      advice: 'An toàn khi ra ngoài',
    };
  }
  if (uvIndex <= 5) {
    return {
      label: 'Trung bình',
      color: '#FFEB3B',
      advice: 'Nên đội mũ, dùng kem chống nắng',
    };
  }
  if (uvIndex <= 7) {
    return {
      label: 'Cao',
      color: '#FF9800',
      advice: 'Hạn chế ra ngoài trưa, mặc áo dài tay',
    };
  }
  if (uvIndex <= 10) {
    return {
      label: 'Rất cao',
      color: '#F44336',
      advice: 'Cực kỳ nguy hiểm, hạn chế tối đa ra ngoài',
    };
  }
  return {
    label: 'Cực cao',
    color: '#9C27B0',
    advice: 'Không ra ngoài nếu có thể, nguy cơ bỏng da cao',
  };
}
