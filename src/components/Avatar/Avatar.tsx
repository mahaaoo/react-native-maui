import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageStyle,
  ImageResizeMode,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface AvatarProps {
  url: string;
  style: ImageStyle;

  delay?: number;
  placeholder?: React.ReactNode;
  resizeMode?: ImageResizeMode;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { style, placeholder, url, resizeMode = 'cover', delay = 500 } = props;
  const [remove, setRemove] = useState(false);
  const finished = useSharedValue(false);

  const loadFinish = useCallback(() => {
    finished.value = true;
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: finished.value ? withTiming(1, { duration: delay }) : 0,
    };
  });

  const placeholderStyle = useAnimatedStyle(() => {
    return {
      opacity: finished.value
        ? withTiming(0, { duration: delay }, () => {
            runOnJS(setRemove)(true);
          })
        : 1,
    };
  });

  return (
    <View>
      <Animated.View style={animationStyle}>
        <Image
          source={{ uri: url }}
          onLoad={loadFinish}
          style={style}
          resizeMode={resizeMode}
        />
      </Animated.View>
      {!remove && (
        <Animated.View style={[styles.placeholder, style, placeholderStyle]}>
          {placeholder}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
});

export default Avatar;
