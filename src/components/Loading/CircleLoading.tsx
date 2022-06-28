import React, { useEffect } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimationSvg = Animated.createAnimatedComponent(Svg);

interface CircleLoadingProps {
  size?: number;
  circle?: number;
  color?: string;
};

const CircleLoading: React.FC<CircleLoadingProps> = props => {
  const {size = 30, circle = 120, color = '#1e90ff'} = props;
  const progress = useSharedValue(0);

  const all = size * 2 * Math.PI * 0.8;
  const dashPath = (Math.PI * 2 / 360) * circle * size * 0.8;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 800,
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
        strokeWidth={6}
        strokeDasharray={`${dashPath} ${all}`}
      />
    </AnimationSvg>
  )
};

export default CircleLoading;
