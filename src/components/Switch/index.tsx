import React, {useCallback, useState, useMemo, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import Animated, {interpolateColor, runOnJS, useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

interface SwitchProps {
  style?: ViewStyle;
  activeBackgroundColor?: string;
  inactiveBackgroundColor?: string;
  disabled?: boolean;
  value?: boolean;

  onChange?: (value: boolean) => void;
}

const Switch: React.FC<SwitchProps> = props => {
  const {
    activeBackgroundColor = '#3279FD', 
    inactiveBackgroundColor = '#dcdcdc', 
    style,
    value,
    onChange,
    disabled
  } = props;
  const [on, setOn] = useState<boolean>(value || false);
  const translateX = useSharedValue(0);

  const containerStyle = useMemo(() => {
    return {
      ...style,
      height: typeof style?.height === 'number' ? style.height : 34,
      width: typeof style?.width === 'number' ? style.width : 55,
      borderRadius: typeof style?.height === 'number' ? style?.height / 2 : 17,
      padding: typeof style?.padding === 'number' ? style?.padding : 2,
    }
  }, [style]);

  useEffect(() => {
    let value = 0;
    if (!on) {
      value = 0;
    } else {
      value = containerStyle.width - containerStyle.height;
    }
    translateX.value = withTiming(value, {duration: 200}, () => runOnJS(handleOnChange)())
  }, [on]);

  const handleOnChange = useCallback(() => {
    onChange && onChange(on);
  }, [on])

  const handlePress = useCallback(() => {
    if (disabled) return;
    setOn(on => !on);
  }, [disabled, value]);

  useEffect(() => {
    if (!!value) {
      setOn(value);
    }
  }, [value]);

  const animationBackground = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(translateX.value, [0, containerStyle.height - containerStyle.padding * 2], [inactiveBackgroundColor, activeBackgroundColor])
    }
  });

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value,
      }]
    }
  })

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={[styles.container,containerStyle, animationBackground]}>
        <Animated.View style={[styles.switch, {
          height: containerStyle.height - containerStyle.padding * 2,
          width: containerStyle.height - containerStyle.padding * 2,
          borderRadius: (containerStyle.height - containerStyle.padding * 2) / 2
        }, animationStyle]} />
      </Animated.View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  switch: {
    backgroundColor: '#fff',
  }
})

export default Switch;
