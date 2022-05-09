import React, {useRef, useCallback, useState, useMemo, useEffect} from 'react';
import {StyleSheet, Animated, TouchableOpacity, ViewStyle} from 'react-native';

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
  const switchTranslateX = useRef(new Animated.Value(0)).current;

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
    Animated.timing(switchTranslateX, {
      toValue: value,
      duration: 200,
      useNativeDriver: false
    }).start(() => {
      onChange && onChange(on);
    });
  }, [on]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    setOn(!on);
  }, [disabled, on, value]);

  useEffect(() => {
    if (!!value) {
      setOn(value);
    }
  }, [value]);

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={[styles.container,containerStyle, {
        backgroundColor: switchTranslateX.interpolate({
          inputRange: [0, containerStyle.height - containerStyle.padding * 2],
          outputRange: [inactiveBackgroundColor, activeBackgroundColor],
        })
      }]}>
        <Animated.View style={[styles.switch, {
          height: containerStyle.height - containerStyle.padding * 2,
          width: containerStyle.height - containerStyle.padding * 2,
          borderRadius: (containerStyle.height - containerStyle.padding * 2) / 2
        },{
          transform: [{
            translateX: switchTranslateX,
          }]
        }]} />
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
