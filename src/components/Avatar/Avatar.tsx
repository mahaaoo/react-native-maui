import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Animated, Image, ImageStyle, ImageResizeMode} from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface AvatarProps {
  url: string;
  style: ImageStyle;
  placeholder?: React.ReactNode;
  resizeMode?: ImageResizeMode
}

const Avatar: React.FC<AvatarProps> = props => {
  const {style, placeholder, url, resizeMode='cover'} = props;
  const [finished, setFinished] = useState(false);

  const loadFinish = useCallback(() => {
    setFinished(true);
  }, []);

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: finished ? withTiming(1, {duration: 500}) : 0
    }
  })

  return (
    <View>
      <Animated.View style={animationStyle}>
        <Image 
          source={{uri: url}}
          onLoad={loadFinish}
          style={style}
          resizeMode={resizeMode}
        />  
      </Animated.View>
      {
        !finished && (
          <Animated.View style={[styles.placeholder, style]}>
            {placeholder}
          </Animated.View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  }
});

export default Avatar;
