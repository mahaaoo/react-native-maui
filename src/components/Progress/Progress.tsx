import React, { useEffect, useMemo } from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

interface ProgressProps {
  activeColor?: string;
  inactiveColor?: string;
  value: number;
  style: ViewStyle;
  toValue?: number;
};

const Progress: React.FC<ProgressProps> = props => {
  const {
    activeColor='#1e90ff',
    inactiveColor='#D8D8D8',
    value,
    style,
    toValue,
  } = props;

  const progress = useSharedValue(value);

  useEffect(() => {
    if (toValue && toValue > value) {
      progress.value = withDelay(500, withTiming(toValue, {duration: 1000, easing: Easing.bezier(0.33, 1, 0.68, 1)}));
    }
  }, [])

  const borderRadius = useMemo(() => {
    return style?.borderRadius || 0;
  }, [style]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      height: '100%',
      width: `${progress.value}%`,
      backgroundColor: activeColor,
      borderRadius
    }
  }, [value, activeColor, borderRadius]);
  
  return (
    <View style={[style, { backgroundColor: inactiveColor}]}>
      <Animated.View style={[progressStyle]} />
    </View>
  )
};

export default Progress;
