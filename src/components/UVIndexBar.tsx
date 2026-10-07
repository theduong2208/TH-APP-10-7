import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, LinearGradient, Defs, Stop, Circle } from 'react-native-svg';
import { getUVLevel } from '../utils/weatherCodes';
import { Colors } from '../theme/colors';
import { FontSize, FontWeight, Spacing } from '../theme/spacing';

interface UVIndexBarProps {
  uvIndex: number;
  barWidth?: number;
}

// Thanh UV Index với gradient màu và chỉ số vị trí
const UVIndexBar: React.FC<UVIndexBarProps> = ({ uvIndex, barWidth = 180 }) => {
  const uvLevel = getUVLevel(uvIndex);
  const maxUV = 11;
  // Tính vị trí indicator trên thanh (0..1)
  const position = Math.min(uvIndex / maxUV, 1);
  const indicatorX = position * barWidth;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={[styles.uvValue, { color: uvLevel.color }]}>
          {uvIndex.toFixed(1)}
        </Text>
        <Text style={[styles.uvLabel, { color: uvLevel.color }]}>
          {uvLevel.label}
        </Text>
      </View>

      {/* Thanh gradient UV */}
      <Svg width={barWidth} height={20}>
        <Defs>
          <LinearGradient id="uvGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4CAF50" />
            <Stop offset="27%" stopColor="#FFEB3B" />
            <Stop offset="54%" stopColor="#FF9800" />
            <Stop offset="81%" stopColor="#F44336" />
            <Stop offset="100%" stopColor="#9C27B0" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={6} width={barWidth} height={8} rx={4} fill="url(#uvGrad)" />
        {/* Indicator tròn */}
        <Circle cx={indicatorX} cy={10} r={7} fill="#FFFFFF" />
        <Circle cx={indicatorX} cy={10} r={4} fill={uvLevel.color} />
      </Svg>

      {/* Nhãn mức */}
      <View style={styles.labels}>
        <Text style={styles.labelText}>Thấp</Text>
        <Text style={styles.labelText}>Cao</Text>
        <Text style={styles.labelText}>Cực cao</Text>
      </View>

      <Text style={styles.advice}>{uvLevel.advice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  uvValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  uvLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 180,
  },
  labelText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  advice: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});

export default UVIndexBar;
