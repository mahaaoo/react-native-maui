import React, { useEffect } from 'react';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimationSvg = Animated.createAnimatedComponent(Svg);

interface CircleLoadProps {
  size?: number;
  circle?: number;
  color?: string;
};

const CircleLoad: React.FC<CircleLoadProps> = props => {
  const {size = 30, circle = 120, color = '#1e90ff'} = props;
  const progress = useSharedValue(0);

  const all = size * 2 * Math.PI * 0.8;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 800,
        easing: Easing.bezier(0.65, 0, 0.35, 1)
      }),
      -1,
      false,
    )
  }, [])

  const animationStyle = useAnimatedStyle(() => {
    const degree = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [{
        rotateZ: `${degree}deg`
      }]
    }
  })

  return (
    <AnimationSvg width={size * 2} height={size * 2} style={animationStyle}>
      <Circle
        cx={size}
        cy={size}
        r={size * 0.8}
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${circle} ${all}`}
      />
    </AnimationSvg>
  )
};

export default CircleLoad;
