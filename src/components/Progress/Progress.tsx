import React, { useEffect } from 'react';
import {View, ViewStyle} from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface ProgressProps {
  activeColor?: string | string[];
  inactiveColor?: string;
  value: number;
  toValue?: number;

  radius?: boolean;
  width?: number;
  height?: number;
  style?: ViewStyle;
  delay?: number;
};

const Progress: React.FC<ProgressProps> = props => {
  const {
    activeColor='#1e90ff',
    inactiveColor='#D8D8D8',
    value,
    toValue,
    width = 300,
    height = 15,
    style,
    radius = false,
    delay = 1000,
  } = props;

  const progress = useSharedValue(value);

  useEffect(() => {
    if (toValue && toValue > value) {
      progress.value = withDelay(delay, withTiming(toValue, {duration: 1000, easing: Easing.bezier(0.33, 1, 0.68, 1)}));
    }
  }, [])
  
  const animatedProps = useAnimatedProps(() => {
    const totalWidth = width || 0;
    const x = totalWidth / 100 * progress.value;
    const y = height / 2;
    
    return {
      d: `M 0,${y} L ${x},${y}`,
    }
  });

  return (
    <View style={[{ backgroundColor: inactiveColor, width, height, borderRadius: radius ? height / 2 : 0, overflow: 'hidden' }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="progress" x1="0" y1="0" x2="1" y2="0">
          {
            Array.isArray(activeColor) && activeColor?.map((color, index) => {
              return <Stop key={`progress_stop${index}`} offset={index/activeColor.length} stopColor={color} stopOpacity="1" />
            })
          }
          </LinearGradient>
        </Defs>
        <AnimatedPath
          animatedProps={animatedProps}
          stroke={Array.isArray(activeColor) ? 'url(#progress)' : activeColor}
          strokeWidth={height}
          strokeLinecap={radius? 'round' : "square"}
        />
      </Svg>
    </View>
  )
};

export default Progress;
