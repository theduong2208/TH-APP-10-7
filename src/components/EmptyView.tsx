import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Spacing, FontSize, BorderRadius, FontWeight } from '../theme/spacing';

interface EmptyViewProps {
  onSearch?: () => void;
}

// Màn hình trống khi chưa có địa điểm
const EmptyView: React.FC<EmptyViewProps> = ({ onSearch }) => {
  return (
    <View style={styles.container}>
      <Icon name="map-search-outline" size={80} color="rgba(255,255,255,0.5)" />
      <Text style={styles.title}>Chào mừng đến với Thời Tiết</Text>
      <Text style={styles.subtitle}>
        Cho phép truy cập vị trí hoặc tìm kiếm một thành phố để xem dự báo thời tiết.
      </Text>
      {onSearch && (
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch} activeOpacity={0.8}>
          <Icon name="magnify" size={22} color={Colors.textPrimary} />
          <Text style={styles.searchText}>Tìm kiếm thành phố</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  searchText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
});

export default EmptyView;
