import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  interpolate,
  useAnimatedProps,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimationSvg = Animated.createAnimatedComponent(Svg);
const AnimationCircle = Animated.createAnimatedComponent(Circle);

interface GrowLoadingProps {
  size?: number;
  color?: string;
  duration?: number;
}

const GrowLoading: React.FC<GrowLoadingProps> = (props) => {
  const { size = 30, color = '#1e90ff', duration = 2000 } = props;
  const progress = useSharedValue(0);
  const all = size * 2 * Math.PI * 0.8;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration,
      }),
      -1,
      false
    );
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    const degree = interpolate(progress.value, [0, 1], [0, 360]);
    return {
      transform: [
        {
          rotateZ: `${degree}deg`,
        },
      ],
    };
  });

  const animatedProps = useAnimatedProps(() => {
    const offset = interpolate(progress.value, [0, 1], [all, -all]);
    return {
      strokeDashoffset: offset,
    };
  });

  return (
    <AnimationSvg width={size * 2} height={size * 2} style={animationStyle}>
      <AnimationCircle
        cx={size}
        cy={size}
        r={size * 0.8}
        stroke={color}
        strokeWidth={6}
        strokeDasharray={all}
        animatedProps={animatedProps}
      />
    </AnimationSvg>
  );
};

export default GrowLoading;
