import React, { useCallback, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

interface ImageContainerProps {
  children: React.ReactNode;
  currentIndex: Animated.SharedValue<number>;
  index: number;

  onPress: () => void;
  onLayout: (position: Position) => void;
}

export type Position = {
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
  height: number | undefined;
  pageX: number | undefined;
  pageY: number | undefined;
};

const ImageContainer: React.FC<ImageContainerProps> = (props) => {
  const { children, onPress, onLayout, currentIndex, index } = props;
  const aref = useRef<View | null>(null);

  const handleLayout = useCallback(() => {
    try {
      aref?.current?.measure((x, y, width, height, pageX, pageY) => {
        onLayout &&
          onLayout({
            x,
            y,
            width,
            height,
            pageX,
            pageY,
          });
      });
    } catch {
      onLayout &&
        onLayout({
          height: undefined,
          width: undefined,
          x: undefined,
          y: undefined,
          pageX: undefined,
          pageY: undefined,
        });
    }
  }, []);

  const handlePress = useCallback(() => {
    onPress && onPress();
  }, [onPress]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: currentIndex.value === index ? 0 : 1,
    };
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={animationStyle}>
        <View ref={(ref) => (aref.current = ref)} onLayout={handleLayout}>
          {children}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ImageContainer;
