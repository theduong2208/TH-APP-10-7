import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/weather';
import {
  getWeatherDescription,
  getWeatherGradient,
  getWeatherIcon,
  getWindDirectionLabel,
  getUVLevel,
} from '../utils/weatherCodes';
import {
  formatTemp,
  formatHour,
  formatFullDay,
  formatSunTime,
} from '../utils/formatters';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight } from '../theme/spacing';
import WeatherIcon from '../components/WeatherIcon';
import WindCompass from '../components/WindCompass';
import UVIndexBar from '../components/UVIndexBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// Hàng hiển thị một chỉ số chi tiết
const InfoRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color = 'rgba(255,255,255,0.85)' }) => (
  <View style={detailStyles.infoRow}>
    <Icon name={icon} size={20} color="rgba(255,255,255,0.7)" />
    <Text style={detailStyles.infoLabel}>{label}</Text>
    <Text style={[detailStyles.infoValue, { color }]}>{value}</Text>
  </View>
);

// Màn hình chi tiết thời tiết theo giờ hoặc ngày
const DetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { type, hourlyItem, dailyItem, locationName } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // Cài StatusBar trong suốt
    StatusBar.setBarStyle('light-content');
    const sb = StatusBar as any;
    if (sb.setBackgroundColor) sb.setBackgroundColor('transparent');
    if (sb.setTranslucent) sb.setTranslucent(true);
  }, [fadeAnim, slideAnim]);

  // Lấy dữ liệu theo loại (giờ hoặc ngày)
  const isHourly = type === 'hourly';

  const weatherCode = isHourly
    ? (hourlyItem?.weatherCode ?? 0)
    : (dailyItem?.weatherCode ?? 0);

  const temperature = isHourly
    ? hourlyItem?.temperature ?? 0
    : dailyItem?.tempMax ?? 0;

  const apparentTemp = isHourly
    ? hourlyItem?.apparentTemperature ?? 0
    : dailyItem?.apparentTempMax ?? 0;

  const humidity = isHourly
    ? hourlyItem?.humidity ?? 0
    : 0; // daily không có humidity trực tiếp

  const windSpeed = isHourly
    ? hourlyItem?.windSpeed ?? 0
    : dailyItem?.windSpeedMax ?? 0;

  const windDirection = isHourly
    ? hourlyItem?.windDirection ?? 0
    : dailyItem?.windDirectionDominant ?? 0;

  const uvIndex = isHourly
    ? hourlyItem?.uvIndex ?? 0
    : dailyItem?.uvIndexMax ?? 0;

  const precipitation = isHourly
    ? hourlyItem?.precipitation ?? 0
    : dailyItem?.precipitationSum ?? 0;

  const precipitationProb = isHourly
    ? hourlyItem?.precipitationProbability ?? 0
    : dailyItem?.precipitationProbability ?? 0;

  const pressure = isHourly ? hourlyItem?.pressure ?? 0 : 0;

  const visibility = isHourly
    ? (hourlyItem?.visibility ?? 0) / 1000
    : 0;

  // Tiêu đề màn hình
  const title = isHourly
    ? formatHour(hourlyItem?.time ?? '')
    : formatFullDay(dailyItem?.date ?? '', 0);

  const subtitle = locationName ?? '';

  // Gradient theo thời tiết
  const gradientColors = getWeatherGradient(weatherCode, isHourly ? true : true);

  const uvLevel = getUVLevel(uvIndex);

  return (
    <LinearGradient colors={gradientColors} style={detailStyles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={detailStyles.safeArea}>
        {/* Header */}
        <View style={detailStyles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={detailStyles.backBtn}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={detailStyles.headerTitle}>
            <Text style={detailStyles.titleText}>{title}</Text>
            {subtitle ? (
              <Text style={detailStyles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={detailStyles.scrollContent}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}>

            {/* Icon + nhiệt độ lớn */}
            <View style={detailStyles.heroSection}>
              <WeatherIcon
                code={weatherCode}
                isDay
                size={90}
                color="#FFFFFF"
                animated
              />
              <Text style={detailStyles.heroTemp}>
                {Math.round(temperature)}°
              </Text>
              <Text style={detailStyles.heroDesc}>
                {getWeatherDescription(weatherCode)}
              </Text>
              {isHourly && (
                <Text style={detailStyles.feelsLike}>
                  Cảm giác như {Math.round(apparentTemp)}°
                </Text>
              )}
              {!isHourly && dailyItem && (
                <Text style={detailStyles.feelsLike}>
                  Cao {formatTemp(dailyItem.tempMax)} · Thấp {formatTemp(dailyItem.tempMin)}
                </Text>
              )}
            </View>

            {/* Card chi tiết */}
            <View style={detailStyles.card}>

              {/* Gió */}
              <View style={detailStyles.windSection}>
                <View style={detailStyles.windInfo}>
                  <InfoRow
                    icon="weather-windy"
                    label="Tốc độ gió"
                    value={`${Math.round(windSpeed)} km/h`}
                  />
                  <InfoRow
                    icon="compass"
                    label="Hướng gió"
                    value={`${getWindDirectionLabel(windDirection)} (${Math.round(windDirection)}°)`}
                  />
                </View>
                <WindCompass degrees={windDirection} size={100} />
              </View>

              <View style={detailStyles.divider} />

              {/* Mưa */}
              <InfoRow
                icon="water"
                label="Lượng mưa"
                value={`${precipitation.toFixed(1)} mm`}
                color="#64B5F6"
              />
              <InfoRow
                icon="umbrella"
                label="Xác suất mưa"
                value={`${Math.round(precipitationProb)}%`}
                color="#64B5F6"
              />

              <View style={detailStyles.divider} />

              {/* Độ ẩm & áp suất & tầm nhìn (chỉ cho hourly) */}
              {isHourly && (
                <>
                  <InfoRow
                    icon="water-percent"
                    label="Độ ẩm"
                    value={`${Math.round(humidity)}%`}
                  />
                  <InfoRow
                    icon="gauge"
                    label="Áp suất"
                    value={`${Math.round(pressure)} hPa`}
                  />
                  <InfoRow
                    icon="eye-outline"
                    label="Tầm nhìn"
                    value={`${visibility >= 10 ? Math.round(visibility) : visibility.toFixed(1)} km`}
                  />
                  <View style={detailStyles.divider} />
                </>
              )}

              {/* UV Index */}
              <View style={detailStyles.uvSection}>
                <Text style={detailStyles.uvTitle}>☀️ Chỉ số UV</Text>
                <UVIndexBar uvIndex={uvIndex} barWidth={240} />
              </View>

              {/* Mặt trời mọc/lặn (chỉ cho daily) */}
              {!isHourly && dailyItem && (
                <>
                  <View style={detailStyles.divider} />
                  <InfoRow
                    icon="weather-sunset-up"
                    label="Mặt trời mọc"
                    value={formatSunTime(dailyItem.sunrise)}
                    color="#FFD700"
                  />
                  <InfoRow
                    icon="weather-sunset-down"
                    label="Mặt trời lặn"
                    value={formatSunTime(dailyItem.sunset)}
                    color="#FF8C00"
                  />
                </>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const detailStyles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BorderRadius.full,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitleText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.xs,
  },
  heroTemp: {
    fontSize: 80,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    lineHeight: 84,
    letterSpacing: -2,
  },
  heroDesc: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  feelsLike: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.6)',
  },
  card: {
    backgroundColor: Colors.glassBg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  infoLabel: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: Spacing.xs,
  },
  windSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  windInfo: {
    flex: 1,
  },
  uvSection: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  uvTitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
});

export default DetailScreen;
