import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { searchCity } from '../api/geocodingApi';
import { GeocodingResult, RootStackParamList, Coordinates } from '../types/weather';
import { Colors } from '../theme/colors';
import { Spacing, BorderRadius, FontSize, FontWeight } from '../theme/spacing';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

// Màn hình tìm kiếm thành phố
const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  // Bật status bar trong suốt
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    const sb = StatusBar as any;
    if (sb.setBackgroundColor) sb.setBackgroundColor('transparent');
    if (sb.setTranslucent) sb.setTranslucent(true);
  }, []);

  // Focus input ngay khi màn hình mở
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, []);

  // Tìm kiếm với debounce nhẹ
  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    if (text.trim().length < 2) return;

    // Hủy request cũ
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await searchCity(text.trim(), controller.signal);
      if (!controller.signal.aborted) {
        setResults(data);
        setSearched(true);
      }
    } catch (err: any) {
      if (!controller.signal.aborted) {
        setError('Không thể tìm kiếm. Kiểm tra kết nối mạng.');
        setResults([]);
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  // Cleanup khi unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Người dùng chọn một thành phố -> điều hướng về Home với tọa độ mới
  const handleSelectCity = (city: GeocodingResult) => {
    Keyboard.dismiss();
    // Điều hướng về Home và truyền tọa độ qua navigation state
    // HomeScreen sẽ listen thông qua route.params khi được truyền
    navigation.navigate('Home');
    // Dùng setTimeout để đảm bảo navigation hoàn tất trước
    // HomeScreen sẽ cần nhận tọa độ - ta dùng cách khác: global state hoặc callback
    // Cách đơn giản nhất: lưu vào module-level variable rồi HomeScreen đọc
    selectedCityCoords = { latitude: city.latitude, longitude: city.longitude };
    selectedCityName = `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}`;
  };

  return (
    <LinearGradient colors={['#1a1a2e', '#16213e', '#0f3460']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}>
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tìm kiếm địa điểm</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Thanh tìm kiếm */}
        <View style={styles.searchBar}>
          <Icon name="magnify" size={22} color="rgba(255,255,255,0.6)" />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Nhập tên thành phố..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {loading && <ActivityIndicator size="small" color="rgba(255,255,255,0.7)" />}
          {query.length > 0 && !loading && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </View>

        {/* Kết quả */}
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : searched && results.length === 0 && !loading ? (
          <View style={styles.emptyContainer}>
            <Icon name="map-search-outline" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyText}>
              Không tìm thấy "{query}". Hãy thử tên khác.
            </Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => handleSelectCity(item)}
                activeOpacity={0.75}>
                <Icon name="map-marker" size={20} color="rgba(255,255,255,0.6)" />
                <View style={styles.cityInfo}>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <Text style={styles.cityRegion}>
                    {[item.admin1, item.country].filter(Boolean).join(', ')}
                  </Text>
                </View>
                <Icon name="chevron-right" size={18} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        {/* Gợi ý một số thành phố phổ biến Việt Nam */}
        {!searched && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestTitle}>Thành phố phổ biến</Text>
            {POPULAR_CITIES.map(city => (
              <TouchableOpacity
                key={city.name}
                style={styles.suggestItem}
                onPress={() => handleSelectCity(city)}
                activeOpacity={0.75}>
                <Icon name="map-marker-outline" size={18} color="rgba(255,255,255,0.5)" />
                <Text style={styles.suggestText}>{city.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

// Tọa độ và tên được chọn - module-level để HomeScreen đọc
export let selectedCityCoords: Coordinates | null = null;
export let selectedCityName: string = '';
export const clearSelectedCity = () => {
  selectedCityCoords = null;
  selectedCityName = '';
};

// Thành phố phổ biến Việt Nam
const POPULAR_CITIES: GeocodingResult[] = [
  { id: 1, name: 'Hà Nội', latitude: 21.0285, longitude: 105.8542, country: 'Việt Nam', admin1: '' },
  { id: 2, name: 'TP. Hồ Chí Minh', latitude: 10.8231, longitude: 106.6297, country: 'Việt Nam', admin1: '' },
  { id: 3, name: 'Đà Nẵng', latitude: 16.0544, longitude: 108.2022, country: 'Việt Nam', admin1: '' },
  { id: 4, name: 'Huế', latitude: 16.4637, longitude: 107.5909, country: 'Việt Nam', admin1: '' },
  { id: 5, name: 'Nha Trang', latitude: 12.2388, longitude: 109.1967, country: 'Việt Nam', admin1: '' },
  { id: 6, name: 'Cần Thơ', latitude: 10.0452, longitude: 105.7469, country: 'Việt Nam', admin1: '' },
];

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
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
    textAlign: 'center',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    padding: 0,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  cityInfo: { flex: 1 },
  cityName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  cityRegion: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  separator: { height: 0 },
  errorText: {
    textAlign: 'center',
    color: '#FF6B6B',
    fontSize: FontSize.md,
    padding: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: FontSize.md,
  },
  suggestions: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  suggestTitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    fontWeight: FontWeight.medium,
  },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm + 2,
  },
  suggestText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});

export default SearchScreen;
