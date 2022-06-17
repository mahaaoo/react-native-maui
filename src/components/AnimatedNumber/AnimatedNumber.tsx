import React, { useEffect, useMemo, useState } from 'react';
import {EasingFunction, Text, TextStyle} from 'react-native';
import { Easing, EasingFunctionFactory, runOnJS, useAnimatedReaction, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

interface AnimatedNumberProps {
  value: number;
  toValue: number;

  style?: TextStyle;
  toFixed?: number;
  duration?: number;
  delay?: number;

  easing?: 'linear' | 'ease' | EasingFunction | EasingFunctionFactory;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = props => {
  const {
    value, 
    toValue, 
    style, 
    toFixed = 0, 
    duration = 1000, 
    delay = 500,
    easing = 'linear',
  } = props;
  const animation = useSharedValue<number>(value);
  const [show, setShow] = useState<number>(value);

  const initialEasing = useMemo(() => {
    if (typeof easing === 'string') {
      if (easing == 'linear') return Easing.linear;
      if (easing == 'ease') return Easing.ease;
    }
    
    return easing;
  }, [easing])


  useEffect(() => {
    animation.value = withDelay(delay, withTiming(toValue, {duration, easing: initialEasing}));
  }, []);

  useAnimatedReaction(() => Number(animation.value.toFixed(toFixed)), (value) => {
    runOnJS(setShow)(value);
  });

  return (
    <Text style={style}>{show}</Text>
  )
};

export default AnimatedNumber;
