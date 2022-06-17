import React, { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, {Circle, Path} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
interface CircleProgressProps {
  value: number; // percent: 0%-100%

  size?: number;
  toValue?: number;
  width?: number;
  activeColor?: string;
  inactiveColor?: string;
};

const CircleProgress: React.FC<CircleProgressProps> = props => {
  const {size = 100, value, toValue, width = 10, activeColor="#1e90ff", inactiveColor='#D8D8D8'} = props;
  const progress = useSharedValue(value);
  
  useEffect(() => {
    if (toValue && toValue > value) {
      progress.value = withTiming(toValue, {duration: 1000});
    }
  }, []);

  const getEndPoint = useCallback((value: number) => {
    'worklet';
    const R = size - width;

    const startPoint = {
      x: size,
      y: size - R,
    }

    let theta;
    if (value >= 100) {
      theta = Math.PI / 180 * 359;
    } else if (value <= 0) {
      theta = 0;
    } else {
      theta = (2 * Math.PI / 100) * value;
    }

    const endPoint = {
      x: size + Math.sin(theta) * R,
      y: size - Math.cos(theta) * R,
    }

    return {
      startPoint,
      theta,
      endPoint,
      R,
    }
  }, [size, width])

  const animatedProps = useAnimatedProps(() => {
    const {startPoint, endPoint, theta, R} = getEndPoint(progress.value);    
    return {
      d: `M ${startPoint.x} ${startPoint.y} A ${R} ${R} 0 ${theta > Math.PI ? '1' : '0'} 1 ${endPoint.x} ${endPoint.y} ${progress.value == 100 ? 'Z' : ''}`,
    }
  });

  return (
    <Svg width={size * 2} height={size * 2} style={{ backgroundColor: 'white' }}>
      <Circle
        cx={size}
        cy={size}
        r={size-width}
        stroke={inactiveColor}
        strokeWidth={width}
      />
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={activeColor}
        strokeWidth={width}
        strokeLinecap={"round"}
        style={{
          ...StyleSheet.absoluteFillObject
        }}
      />
    </Svg>
  )
};

export default CircleProgress;
