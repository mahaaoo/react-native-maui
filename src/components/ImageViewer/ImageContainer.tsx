import React, { useCallback, useEffect, useRef,  } from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import { useAnimatedRef } from 'react-native-reanimated';

interface ImageContainerProps {
  children: React.ReactNode,
  onPress: () => void;
  onLayout: (position: Position) => void;
};

export type Position = {
  height: number,
  width: number,
  x: number,
  y: number,
  pageX: number
  pageY: number
}

const ImageContainer: React.FC<ImageContainerProps> = props => {
  const {children, onPress, onLayout} = props;
  const position = useRef<Position>({} as Position);
  const aref = useAnimatedRef<View>();

  useEffect(() => {
    if (aref && aref.current) {
      aref.current.measure((x, y, width, height, pageX, pageY) => {
        position.current = {
          x,
          y,
          width,
          height,
          pageX,
          pageY
        }
        onLayout && onLayout(position.current);
      });
    }
  }, [])

  const handlePress = useCallback(() => {
    onPress && onPress();
  }, [onPress]);

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <View ref={aref}>
        {children}
      </View>
    </TouchableOpacity>
  )
};

export default ImageContainer;
