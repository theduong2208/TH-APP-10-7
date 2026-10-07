import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../theme/colors';
import { Spacing, FontSize, BorderRadius, FontWeight } from '../theme/spacing';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  onSearch?: () => void;
}

// Màn hình lỗi với icon, thông báo tiếng Việt và nút thử lại
const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry, onSearch }) => {
  return (
    <View style={styles.container}>
      <Icon name="wifi-off" size={64} color="rgba(255,255,255,0.6)" />
      <Text style={styles.title}>Không thể tải dữ liệu</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Icon name="refresh" size={20} color={Colors.textPrimary} />
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      )}

      {onSearch && (
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch} activeOpacity={0.8}>
          <Icon name="magnify" size={20} color="rgba(255,255,255,0.9)" />
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
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glassBg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  retryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  searchText: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.75)',
    textDecorationLine: 'underline',
  },
});

export default ErrorView;
