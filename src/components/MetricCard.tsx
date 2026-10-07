import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight } from '../theme/spacing';
import WindCompass from './WindCompass';
import UVIndexBar from './UVIndexBar';
import {
  formatTemp,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatPrecipitation,
  formatHumidity,
} from '../utils/formatters';

export type MetricType =
  | 'temperature'
  | 'humidity'
  | 'wind_speed'
  | 'wind_direction'
  | 'uv'
  | 'precipitation'
  | 'pressure'
  | 'visibility';

interface MetricCardProps {
  type: MetricType;
  value: number;
  // Chỉ dùng cho wind_direction
  windDirection?: number;
  // Chỉ dùng cho temperature (max/min)
  tempMax?: number;
  tempMin?: number;
}

// Component thẻ chỉ số thời tiết tái sử dụng
const MetricCard: React.FC<MetricCardProps> = ({
  type,
  value,
  windDirection = 0,
  tempMax,
  tempMin,
}) => {
  const { width } = useWindowDimensions();
  const cardSize = (width - Spacing.md * 2 - Spacing.sm) / 2;

  // Vòng tròn tiến trình cho độ ẩm
  const HumidityRing = ({ percent }: { percent: number }) => {
    const size = 60;
    const r = 24;
    const circumference = 2 * Math.PI * r;
    const progress = (percent / 100) * circumference;

    return (
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={5}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#64B5F6"
          strokeWidth={5}
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
    );
  };

  // Render nội dung theo loại chỉ số
  const renderContent = () => {
    switch (type) {
      case 'temperature':
        return (
          <View style={styles.centerContent}>
            <Icon name="thermometer" size={28} color="#FF8A65" />
            <Text style={styles.bigValue}>{formatTemp(value)}</Text>
            {tempMax !== undefined && tempMin !== undefined && (
              <Text style={styles.subValue}>
                {formatTemp(tempMax)} / {formatTemp(tempMin)}
              </Text>
            )}
          </View>
        );

      case 'humidity':
        return (
          <View style={styles.centerContent}>
            <View style={styles.ringContainer}>
              <HumidityRing percent={value} />
              <Text style={styles.ringText}>{Math.round(value)}%</Text>
            </View>
          </View>
        );

      case 'wind_speed':
        return (
          <View style={styles.centerContent}>
            <Icon name="weather-windy" size={28} color="#81D4FA" />
            <Text style={styles.bigValue}>{Math.round(value)}</Text>
            <Text style={styles.unit}>km/h</Text>
          </View>
        );

      case 'wind_direction':
        return (
          <View style={styles.centerContent}>
            <WindCompass degrees={windDirection} size={80} />
          </View>
        );

      case 'uv':
        return (
          <View style={styles.uvContent}>
            <UVIndexBar uvIndex={value} barWidth={cardSize - Spacing.lg * 2} />
          </View>
        );

      case 'precipitation':
        return (
          <View style={styles.centerContent}>
            <Icon name="water" size={28} color="#64B5F6" />
            <Text style={styles.bigValue}>{value.toFixed(1)}</Text>
            <Text style={styles.unit}>mm</Text>
          </View>
        );

      case 'pressure':
        return (
          <View style={styles.centerContent}>
            <Icon name="gauge" size={28} color="#CE93D8" />
            <Text style={styles.bigValue}>{Math.round(value)}</Text>
            <Text style={styles.unit}>hPa</Text>
          </View>
        );

      case 'visibility':
        return (
          <View style={styles.centerContent}>
            <Icon name="eye-outline" size={28} color="#A5D6A7" />
            <Text style={styles.bigValue}>
              {(value / 1000) >= 10
                ? Math.round(value / 1000)
                : (value / 1000).toFixed(1)}
            </Text>
            <Text style={styles.unit}>km</Text>
          </View>
        );
    }
  };

  const titles: Record<MetricType, string> = {
    temperature: '🌡️ Nhiệt độ',
    humidity: '💧 Độ ẩm',
    wind_speed: '💨 Tốc độ gió',
    wind_direction: '🧭 Hướng gió',
    uv: '☀️ Chỉ số UV',
    precipitation: '🌧️ Lượng mưa',
    pressure: '📊 Áp suất',
    visibility: '👁️ Tầm nhìn',
  };

  return (
    <View style={[styles.card, { width: cardSize, minHeight: cardSize }]}>
      <Text style={styles.title}>{titles[type]}</Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.glassBg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginBottom: Spacing.xs,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 2,
  },
  uvContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bigValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  unit: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    position: 'absolute',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
});

export default MetricCard;
