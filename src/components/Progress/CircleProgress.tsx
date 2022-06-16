import React from 'react';
import {View} from 'react-native';
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import Svg, {Path} from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const R = 80

interface CircleProgressProps {
  size?: number;
};

const CircleProgress: React.FC<CircleProgressProps> = props => {
  const {size = 100,} = props;
   
  const center = {
    x: size,
    y: size,
  }

  const startPoint = {
    x: size,
    y: size - R,
  }

  const theta = (Math.PI / 180) * 359;

  const endPoint = {
    x: size + Math.sin(theta) * R,
    y: size - Math.cos(theta) * R,
  }

  console.log([Math.sin(theta), Math.cos(theta)])
  console.log(endPoint);
  

  const animatedProps = useAnimatedProps(() => {
    return {
      d: `M ${startPoint.x} ${startPoint.y} A ${R} ${R} 0 1 1 ${endPoint.x} ${endPoint.y}`,
    }
  })

  return (
    <Svg width={size * 2} height={size * 2} style={{ backgroundColor: 'white' }}>
      <AnimatedPath
        animatedProps={animatedProps}
        stroke={'cyan'}
        strokeWidth={5}
      />
    </Svg>
  )
};

export default CircleProgress;
