// Bảng màu cho ứng dụng thời tiết
export const Colors = {
  // Màu chính
  primary: '#1a1a2e',
  secondary: '#16213e',
  accent: '#0f3460',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.5)',
  textDark: '#1a1a2e',

  // Glassmorphism
  glassBg: 'rgba(255,255,255,0.12)',
  glassBorder: 'rgba(255,255,255,0.2)',
  glassStrong: 'rgba(255,255,255,0.18)',

  // Trạng thái
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',

  // Gradient ngày theo thời tiết
  gradients: {
    // Nắng / Quang đãng - ngày
    clearDay: ['#2980B9', '#6DD5FA', '#FFFFFF'] as string[],
    // Nắng / Quang đãng - đêm
    clearNight: ['#0F2027', '#203A43', '#2C5364'] as string[],
    // Mây rải rác - ngày
    partlyCloudyDay: ['#4A90D9', '#7FB3D3', '#B0C4DE'] as string[],
    // Mây rải rác - đêm
    partlyCloudyNight: ['#141E30', '#243B55', '#3A5A7A'] as string[],
    // Nhiều mây - ngày
    cloudyDay: ['#3D5A80', '#98C1D9', '#BDD5EA'] as string[],
    // Nhiều mây - đêm
    cloudyNight: ['#1a1a2e', '#16213e', '#2d3561'] as string[],
    // Mưa - ngày
    rainyDay: ['#373B44', '#4286f4', '#5B6FA0'] as string[],
    // Mưa - đêm
    rainyNight: ['#0F2027', '#203A43', '#2C5364'] as string[],
    // Bão / Giông tố
    stormyDay: ['#1F1C2C', '#4A3F6B', '#6B5B95'] as string[],
    stormyNight: ['#0D0D0D', '#1F1C2C', '#4A3F6B'] as string[],
    // Tuyết
    snowyDay: ['#8EC5FC', '#E0C3FC', '#F7F7F7'] as string[],
    snowyNight: ['#2C3E50', '#4CA1AF', '#C4E0E5'] as string[],
    // Sương mù
    foggyDay: ['#8a9ba8', '#BBC8CE', '#D0D8DC'] as string[],
    foggyNight: ['#2C3E50', '#4A6274', '#627D8C'] as string[],
    // Mặc định
    defaultDay: ['#2980B9', '#6DD5FA', '#FFFFFF'] as string[],
    defaultNight: ['#0F2027', '#203A43', '#2C5364'] as string[],
  },

  // Màu UV Index
  uvColors: {
    low: '#4CAF50',      // 0-2: Thấp
    moderate: '#FFEB3B', // 3-5: Trung bình
    high: '#FF9800',     // 6-7: Cao
    veryHigh: '#F44336', // 8-10: Rất cao
    extreme: '#9C27B0',  // 11+: Cực cao
  },
};
