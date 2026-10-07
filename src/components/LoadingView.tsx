import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from 'react-native';
import { Colors } from '../theme/colors';
import { BorderRadius, Spacing } from '../theme/spacing';

// Component loading dạng skeleton với shimmer effect
const LoadingView: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();

  useEffect(() => {
    // Animation shimmer liên tục
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBlock = ({
    w,
    h,
    mt = 0,
    mb = 0,
    borderRadius = BorderRadius.md,
  }: {
    w: number | string;
    h: number;
    mt?: number;
    mb?: number;
    borderRadius?: number;
  }) => (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: w,
          height: h,
          marginTop: mt,
          marginBottom: mb,
          borderRadius,
          opacity,
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Skeleton vị trí */}
      <SkeletonBlock w={180} h={20} mt={Spacing.xxl} />
      {/* Skeleton nhiệt độ lớn */}
      <SkeletonBlock w={140} h={90} mt={Spacing.lg} borderRadius={BorderRadius.lg} />
      {/* Skeleton mô tả thời tiết */}
      <SkeletonBlock w={120} h={20} mt={Spacing.md} />
      {/* Skeleton cao/thấp */}
      <SkeletonBlock w={160} h={18} mt={Spacing.sm} />

      {/* Skeleton thẻ giờ */}
      <View style={[styles.row, { marginTop: Spacing.xl }]}>
        {[0, 1, 2, 3, 4].map(i => (
          <SkeletonBlock key={i} w={width / 5 - 12} h={90} borderRadius={BorderRadius.md} />
        ))}
      </View>

      {/* Skeleton thẻ ngày */}
      {[0, 1, 2, 3, 4].map(i => (
        <SkeletonBlock key={i} w={width - Spacing.md * 2} h={56} mt={Spacing.sm} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 60,
  },
  skeleton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    justifyContent: 'space-between',
  },
});

export default LoadingView;
