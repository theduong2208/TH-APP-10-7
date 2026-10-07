import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Polygon, Text as SvgText } from 'react-native-svg';
import { getWindDirectionLabel } from '../utils/weatherCodes';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight } from '../theme/spacing';

interface WindCompassProps {
  degrees: number; // hướng gió tính theo độ (0 = Bắc)
  size?: number;
}

// La bàn SVG với mũi tên xoay theo hướng gió
const WindCompass: React.FC<WindCompassProps> = ({ degrees, size = 120 }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const prevDegrees = useRef(degrees);

  useEffect(() => {
    // Animation xoay mũi tên mượt khi degrees thay đổi
    Animated.spring(rotateAnim, {
      toValue: degrees,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    prevDegrees.current = degrees;
  }, [degrees, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const r = size / 2;
  const cx = r;
  const cy = r;
  const label = getWindDirectionLabel(degrees);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Vòng tròn nền */}
        <Circle
          cx={cx}
          cy={cy}
          r={r - 4}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={2}
          fill="rgba(255,255,255,0.08)"
        />
        {/* Nhãn hướng Bắc/Nam/Đông/Tây */}
        <SvgText
          x={cx}
          y={12}
          textAnchor="middle"
          fill="rgba(255,255,255,0.7)"
          fontSize={10}
          fontWeight="600">
          B
        </SvgText>
        <SvgText
          x={cx}
          y={size - 4}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={10}>
          N
        </SvgText>
        <SvgText
          x={size - 6}
          y={cy + 4}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={10}>
          Đ
        </SvgText>
        <SvgText
          x={6}
          y={cy + 4}
          textAnchor="middle"
          fill="rgba(255,255,255,0.5)"
          fontSize={10}>
          T
        </SvgText>
      </Svg>

      {/* Mũi tên xoay theo hướng gió - dùng Animated.View để rotate */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.arrowContainer,
          { transform: [{ rotate }] },
        ]}>
        <Svg width={size} height={size}>
          {/* Mũi tên hướng gió (đầu màu đỏ = nguồn gió đến từ) */}
          <Polygon
            points={`${cx},${cy - r + 18} ${cx - 7},${cy + 10} ${cx + 7},${cy + 10}`}
            fill="#FF6B6B"
            opacity={0.9}
          />
          <Polygon
            points={`${cx},${cy + r - 18} ${cx - 7},${cy - 10} ${cx + 7},${cy - 10}`}
            fill="rgba(255,255,255,0.5)"
          />
        </Svg>
      </Animated.View>

      {/* Nhãn hướng bên dưới */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default WindCompass;
