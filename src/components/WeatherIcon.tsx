import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getWeatherIcon } from '../utils/weatherCodes';

interface WeatherIconProps {
  code: number;
  isDay: boolean;
  size?: number;
  color?: string;
  // Bật animation nổi lên xuống
  animated?: boolean;
}

// Icon thời tiết với animation nổi nhẹ (float)
const WeatherIcon: React.FC<WeatherIconProps> = ({
  code,
  isDay,
  size = 64,
  color = '#FFFFFF',
  animated = false,
}) => {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const iconName = getWeatherIcon(code, isDay);

  useEffect(() => {
    if (!animated) return;

    // Animation nổi lên xuống liên tục
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    );

    floatAnimation.start();
    return () => floatAnimation.stop();
  }, [animated, floatAnim]);

  if (!animated) {
    return <Icon name={iconName} size={size} color={color} />;
  }

  return (
    <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
      <Icon name={iconName} size={size} color={color} />
    </Animated.View>
  );
};

export default WeatherIcon;
