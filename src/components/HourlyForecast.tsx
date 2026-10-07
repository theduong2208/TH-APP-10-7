import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  type ScrollView as ScrollViewType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProcessedHourlyItem } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherCodes';
import { formatHour, formatTemp, formatRainProb, getCurrentHourIndex } from '../utils/formatters';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight } from '../theme/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/weather';
import { useNavigation } from '@react-navigation/native';

interface HourlyForecastProps {
  items: ProcessedHourlyItem[];
  locationName?: string;
}

// Danh sách dự báo theo giờ - cuộn ngang 24 giờ tới
const HourlyForecast: React.FC<HourlyForecastProps> = ({ items, locationName }) => {
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Lọc 24 giờ tới kể từ hiện tại
  const now = Date.now();
  const next24h = items.filter(item => item.timestamp >= now - 3600000).slice(0, 25);

  const currentIndex = getCurrentHourIndex(items.map(i => i.time));

  // Cuộn đến giờ hiện tại khi mount
  useEffect(() => {
    if (currentIndex > 0) {
      setTimeout(() => {
        (scrollRef.current as any)?.scrollTo({
          x: Math.max(0, currentIndex - 1) * 72,
          animated: true,
        });
      }, 500);
    }
  }, [currentIndex]);

  const isDay = (item: ProcessedHourlyItem): boolean => {
    const hour = new Date(item.time).getHours();
    return hour >= 6 && hour < 18;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📅 Dự báo 24 giờ tới</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {next24h.map((item, index) => {
          const isCurrentHourItem = currentIndex >= 0 && items[currentIndex]?.time === item.time;
          return (
            <TouchableOpacity
              key={item.time}
              style={[styles.hourCard, isCurrentHourItem && styles.hourCardActive]}
              onPress={() =>
                navigation.navigate('Detail', {
                  type: 'hourly',
                  hourlyItem: item,
                  locationName,
                })
              }
              activeOpacity={0.75}>
              {/* Giờ */}
              <Text style={[styles.hourText, isCurrentHourItem && styles.activeText]}>
                {index === 0 && isCurrentHourItem ? 'Bây giờ' : formatHour(item.time)}
              </Text>

              {/* Icon thời tiết */}
              <Icon
                name={getWeatherIcon(item.weatherCode, isDay(item))}
                size={28}
                color={isCurrentHourItem ? '#FFFFFF' : 'rgba(255,255,255,0.85)'}
              />

              {/* Nhiệt độ */}
              <Text style={[styles.tempText, isCurrentHourItem && styles.activeText]}>
                {formatTemp(item.temperature)}
              </Text>

              {/* % mưa */}
              {item.precipitationProbability > 0 && (
                <View style={styles.rainRow}>
                  <Icon name="water" size={10} color="#64B5F6" />
                  <Text style={styles.rainText}>
                    {formatRainProb(item.precipitationProbability)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  scrollContent: {
    paddingVertical: Spacing.xs,
    gap: Spacing.sm,
  },
  hourCard: {
    alignItems: 'center',
    backgroundColor: Colors.glassBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm,
    minWidth: 64,
    gap: Spacing.xs,
  },
  hourCardActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  hourText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  activeText: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
  },
  tempText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semiBold,
  },
  rainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rainText: {
    fontSize: FontSize.xs,
    color: '#64B5F6',
  },
});

export default HourlyForecast;
