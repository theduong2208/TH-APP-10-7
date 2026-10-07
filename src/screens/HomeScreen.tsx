import React, { useEffect, useCallback, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useLocation } from '../hooks/useLocation';
import { useWeather } from '../hooks/useWeather';
import { getWeatherGradient } from '../utils/weatherCodes';
import { RootStackParamList, Coordinates } from '../types/weather';
import {
  selectedCityCoords,
  selectedCityName,
  clearSelectedCity,
} from './SearchScreen';


import CurrentWeatherComponent from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import MetricCard from '../components/MetricCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';
import EmptyView from '../components/EmptyView';
import { Colors } from '../theme/colors';
import { Spacing, FontSize, FontWeight } from '../theme/spacing';

type HomeNav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const { width } = useWindowDimensions();

  // Bật status bar trong suốt bằng bất kỳ method nào khả dụng
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    // setBackgroundColor và setTranslucent không có trong type nhưng tồn tại runtime
    const sb = StatusBar as any;
    if (sb.setBackgroundColor) sb.setBackgroundColor('transparent');
    if (sb.setTranslucent) sb.setTranslucent(true);
  }, []);

  // State lưu tọa độ (GPS hoặc từ tìm kiếm)
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const {
    coordinates: gpsCoords,
    status: locationStatus,
    errorMessage: locationError,
    getCurrentLocation,
    openSettings,
  } = useLocation();

  const {
    loadState,
    weatherData,
    hourlyItems,
    dailyItems,
    locationInfo,
    errorMessage: weatherError,
    refresh,
  } = useWeather(coordinates);

  // Lấy GPS khi khởi động
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Cập nhật tọa độ khi GPS thay đổi
  useEffect(() => {
    if (gpsCoords) {
      setCoordinates(gpsCoords);
    }
  }, [gpsCoords]);

  // Kiểm tra nếu có tọa độ được truyền từ màn hình Search
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (selectedCityCoords) {
        setCoordinates({ ...selectedCityCoords });
        clearSelectedCity();
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getCurrentLocation();
    refresh();
    setRefreshing(false);
  }, [getCurrentLocation, refresh]);

  // Lấy gradient nền theo thời tiết
  const gradientColors: string[] = weatherData
    ? getWeatherGradient(
        weatherData.current.weather_code,
        weatherData.current.is_day === 1,
      )
    : ['#1a1a2e', '#16213e', '#0f3460'];

  // Trạng thái từ chối quyền vĩnh viễn
  if (
    locationStatus === 'denied' ||
    locationStatus === 'denied_forever'
  ) {
    return (
      <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.fullScreen}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.fullScreen}>
          <ErrorView
            message={
              locationError ??
              'Quyền vị trí bị từ chối. Bạn có thể tìm kiếm thành phố thủ công hoặc mở cài đặt.'
            }
            onRetry={
              locationStatus === 'denied' ? getCurrentLocation : undefined
            }
            onSearch={() => navigation.navigate('Search')}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.fullScreen}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.fullScreen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }>

          {/* === LOADING === */}
          {(loadState === 'loading' || locationStatus === 'requesting') && (
            <LoadingView />
          )}

          {/* === ERROR GPS === */}
          {locationStatus === 'error' && loadState !== 'success' && (
            <ErrorView
              message={locationError ?? 'Không thể lấy vị trí'}
              onRetry={getCurrentLocation}
              onSearch={() => navigation.navigate('Search')}
            />
          )}

          {/* === ERROR API === */}
          {loadState === 'error' && locationStatus !== 'error' && (
            <ErrorView
              message={weatherError ?? 'Không thể tải dữ liệu thời tiết'}
              onRetry={refresh}
              onSearch={() => navigation.navigate('Search')}
            />
          )}

          {/* === EMPTY (chưa có tọa độ, không loading, không lỗi) === */}
          {!coordinates && loadState === 'idle' && locationStatus === 'idle' && (
            <EmptyView onSearch={() => navigation.navigate('Search')} />
          )}

          {/* === SUCCESS: Hiển thị dữ liệu === */}
          {loadState === 'success' && weatherData && locationInfo && (
            <>
              {/* Thời tiết hiện tại */}
              <CurrentWeatherComponent
                current={weatherData.current}
                daily={weatherData.daily}
                locationInfo={locationInfo}
                onRefresh={onRefresh}
                onSearch={() => navigation.navigate('Search')}
              />

              {/* Dự báo theo giờ */}
              <HourlyForecast
                items={hourlyItems}
                locationName={locationInfo.displayName}
              />

              {/* Dự báo 7 ngày */}
              <DailyForecast
                items={dailyItems}
                locationName={locationInfo.displayName}
              />

              {/* Lưới 8 chỉ số */}
              <View style={styles.metricsSection}>
                <View style={styles.metricsGrid}>
                  <MetricCard
                    type="humidity"
                    value={weatherData.current.relative_humidity_2m}
                  />
                  <MetricCard
                    type="wind_speed"
                    value={weatherData.current.wind_speed_10m}
                  />
                  <MetricCard
                    type="wind_direction"
                    value={weatherData.current.wind_direction_10m}
                    windDirection={weatherData.current.wind_direction_10m}
                  />
                  <MetricCard
                    type="precipitation"
                    value={weatherData.current.precipitation}
                  />
                  <MetricCard
                    type="pressure"
                    value={weatherData.current.surface_pressure}
                  />
                  <MetricCard
                    type="visibility"
                    value={
                      hourlyItems.find(
                        h => new Date(h.time).getHours() === new Date().getHours(),
                      )?.visibility ?? 10000
                    }
                  />
                  <MetricCard
                    type="uv"
                    value={
                      hourlyItems.find(
                        h => new Date(h.time).getHours() === new Date().getHours(),
                      )?.uvIndex ?? 0
                    }
                  />
                  <MetricCard
                    type="temperature"
                    value={weatherData.current.temperature_2m}
                    tempMax={dailyItems[0]?.tempMax}
                    tempMin={dailyItems[0]?.tempMin}
                  />
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 48, // Dành chỗ cho status bar trong suốt
    paddingBottom: Spacing.xxl,
  },
  metricsSection: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
});

export default HomeScreen;
