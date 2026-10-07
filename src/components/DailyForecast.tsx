import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProcessedDailyItem } from '../types/weather';
import { getWeatherIcon } from '../utils/weatherCodes';
import { formatShortDay, formatTemp, formatRainProb } from '../utils/formatters';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight } from '../theme/spacing';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/weather';
import { useNavigation } from '@react-navigation/native';

interface DailyForecastProps {
  items: ProcessedDailyItem[];
  locationName?: string;
}

// Danh sách dự báo 7 ngày kèm thanh nhiệt độ trực quan
const DailyForecast: React.FC<DailyForecastProps> = ({ items, locationName }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width } = useWindowDimensions();

  // Tìm nhiệt độ min/max toàn tuần để vẽ thanh tỉ lệ
  const globalMin = Math.min(...items.map(i => i.tempMin));
  const globalMax = Math.max(...items.map(i => i.tempMax));
  const tempRange = globalMax - globalMin || 1;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>📆 Dự báo 7 ngày</Text>
      <View style={styles.card}>
        {items.map((item, index) => {
          // Tính vị trí và chiều rộng thanh nhiệt độ
          const barLeft = ((item.tempMin - globalMin) / tempRange) * 100;
          const barWidth = ((item.tempMax - item.tempMin) / tempRange) * 100;
          const isToday = index === 0;

          return (
            <TouchableOpacity
              key={item.date}
              style={[styles.dayRow, index < items.length - 1 && styles.rowBorder]}
              onPress={() =>
                navigation.navigate('Detail', {
                  type: 'daily',
                  dailyItem: item,
                  locationName,
                })
              }
              activeOpacity={0.75}>
              {/* Tên ngày */}
              <Text style={[styles.dayName, isToday && styles.todayText]}>
                {formatShortDay(item.date, index)}
              </Text>

              {/* Icon thời tiết */}
              <Icon
                name={getWeatherIcon(item.weatherCode, true)}
                size={24}
                color="rgba(255,255,255,0.9)"
              />

              {/* % mưa */}
              {item.precipitationProbability > 0 ? (
                <View style={styles.rainContainer}>
                  <Icon name="water" size={11} color="#64B5F6" />
                  <Text style={styles.rainText}>
                    {formatRainProb(item.precipitationProbability)}
                  </Text>
                </View>
              ) : (
                <View style={styles.rainContainer} />
              )}

              {/* Nhiệt độ min */}
              <Text style={styles.tempMin}>{formatTemp(item.tempMin)}</Text>

              {/* Thanh nhiệt độ gradient */}
              <View style={styles.tempBar}>
                <View style={styles.tempBarBg}>
                  <View
                    style={[
                      styles.tempBarFill,
                      {
                        left: `${barLeft}%`,
                        width: `${barWidth}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Nhiệt độ max */}
              <Text style={styles.tempMax}>{formatTemp(item.tempMax)}</Text>

              {/* Icon mũi tên */}
              <Icon name="chevron-right" size={16} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: Colors.glassBg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden',
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  dayName: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    width: 64,
  },
  todayText: {
    color: '#FFD700',
    fontWeight: FontWeight.bold,
  },
  rainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    width: 36,
  },
  rainText: {
    fontSize: FontSize.xs,
    color: '#64B5F6',
  },
  tempMin: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    width: 32,
    textAlign: 'right',
  },
  tempBar: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
  },
  tempBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  tempBarFill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFB74D',
    borderRadius: 2,
  },
  tempMax: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.semiBold,
    width: 32,
    textAlign: 'left',
  },
});

export default DailyForecast;
