import React, { useCallback, useEffect, useRef } from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated, { useAnimatedRef, useAnimatedStyle } from 'react-native-reanimated';

interface ImageContainerProps {
  children: React.ReactNode,
  currentIndex: Animated.SharedValue<number>;
  index: number;

  onPress: () => void;
  onLayout: (position: Position) => void;
};

export type Position = {
  height: number | undefined,
  width: number | undefined,
  x: number | undefined,
  y: number | undefined,
  pageX: number | undefined,
  pageY: number  | undefined,
}

const ImageContainer: React.FC<ImageContainerProps> = props => {
  const {children, onPress, onLayout, currentIndex, index} = props;
  const aref = useAnimatedRef<View>();

  useEffect(() => {
    if (aref && aref.current) {
      aref.current.measure((x, y, width, height, pageX, pageY) => {
        onLayout && onLayout({
          x,
          y,
          width,
          height,
          pageX,
          pageY
        });
      });
    } else {
      onLayout && onLayout({
        height: undefined,
        width: undefined,
        x: undefined,
        y: undefined,
        pageX: undefined,
        pageY: undefined,
      });
    }
  }, [])

  const handlePress = useCallback(() => {
    onPress && onPress();
  }, [onPress]);


  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: currentIndex.value === index ? 0 : 1
    }
  })

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={animationStyle}>
        <View ref={aref}>
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
};

export default ImageContainer;
