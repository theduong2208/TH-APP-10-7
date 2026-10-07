import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WeatherIcon from './WeatherIcon';
import { CurrentWeather, DailyWeather, LocationInfo } from '../types/weather';
import { getWeatherDescription } from '../utils/weatherCodes';
import { formatTemp, formatSunTime } from '../utils/formatters';
import { Colors } from '../theme/colors';
import { Spacing, FontSize, FontWeight, BorderRadius } from '../theme/spacing';

interface CurrentWeatherProps {
  current: CurrentWeather;
  daily: DailyWeather;
  locationInfo: LocationInfo;
  onRefresh: () => void;
  onSearch: () => void;
}

// Component hiển thị thời tiết hiện tại (phần đầu màn hình Home)
const CurrentWeatherComponent: React.FC<CurrentWeatherProps> = ({
  current,
  daily,
  locationInfo,
  onRefresh,
  onSearch,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Animation fade + slide khi dữ liệu vào
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const isDay = current.is_day === 1;
  const todayMax = daily.temperature_2m_max[0] ?? 0;
  const todayMin = daily.temperature_2m_min[0] ?? 0;
  const sunrise = formatSunTime(daily.sunrise[0] ?? '');
  const sunset = formatSunTime(daily.sunset[0] ?? '');

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      {/* Header: vị trí + nút tìm kiếm */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.locationRow}
          onPress={onSearch}
          activeOpacity={0.8}>
          <Icon name="map-marker" size={18} color="rgba(255,255,255,0.9)" />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationInfo.displayName}
          </Text>
          <Icon name="chevron-down" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn} activeOpacity={0.7}>
          <Icon name="refresh" size={22} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>

      {/* Icon thời tiết với animation nổi */}
      <View style={styles.iconContainer}>
        <WeatherIcon
          code={current.weather_code}
          isDay={isDay}
          size={100}
          color="#FFFFFF"
          animated
        />
      </View>

      {/* Nhiệt độ lớn */}
      <Text style={styles.temperature}>
        {Math.round(current.temperature_2m)}°
      </Text>

      {/* Mô tả thời tiết */}
      <Text style={styles.description}>
        {getWeatherDescription(current.weather_code)}
      </Text>

      {/* Cảm giác như, cao/thấp */}
      <Text style={styles.feelsLike}>
        Cảm giác như {Math.round(current.apparent_temperature)}°
      </Text>

      <View style={styles.highLow}>
        <View style={styles.highLowItem}>
          <Icon name="arrow-up" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.highLowText}>{formatTemp(todayMax)}</Text>
        </View>
        <Text style={styles.separator}>·</Text>
        <View style={styles.highLowItem}>
          <Icon name="arrow-down" size={14} color="rgba(255,255,255,0.8)" />
          <Text style={styles.highLowText}>{formatTemp(todayMin)}</Text>
        </View>
      </View>

      {/* Mặt trời mọc / lặn */}
      <View style={styles.sunRow}>
        <View style={styles.sunItem}>
          <Icon name="weather-sunset-up" size={16} color="rgba(255,200,100,0.9)" />
          <Text style={styles.sunText}>{sunrise}</Text>
        </View>
        <View style={styles.sunItem}>
          <Icon name="weather-sunset-down" size={16} color="rgba(255,150,80,0.9)" />
          <Text style={styles.sunText}>{sunset}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  locationText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  refreshBtn: {
    padding: Spacing.xs,
  },
  iconContainer: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  temperature: {
    fontSize: 96,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    lineHeight: 100,
    letterSpacing: -4,
  },
  description: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    marginTop: Spacing.xs,
  },
  feelsLike: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.65)',
    marginTop: Spacing.xs,
  },
  highLow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  highLowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  highLowText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  separator: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  sunRow: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginTop: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sunText: {
    fontSize: FontSize.sm,
    color: 'rgba(255,220,120,0.9)',
    fontWeight: FontWeight.medium,
  },
});

export default CurrentWeatherComponent;
