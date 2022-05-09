import React, {useMemo, useRef, useCallback} from 'react';
import {View, StyleSheet, Animated, Image} from 'react-native';

interface AvatarProps {
  url?: string;
  size?: number;
  square?: boolean;
  borderRadius?: number;
  placeholder?: React.ReactNode;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = props => {
  const {size = 40, square, placeholder, url, borderRadius, backgroundColor = '#eee'} = props;
  const opacityRef = useRef(new Animated.Value(1)).current;

  const loadFinish = useCallback(() => {
    Animated.timing(opacityRef, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const buildStyle = useMemo(() => {
    if (square) {
      return {
        height: size,
        width: size,  
        borderRadius: borderRadius,
      }
    }
    return {
      height: size,
      width: size,
      borderRadius: size / 2,
    }
  }, [size, square]);

  return (
    <View style={[styles.container, buildStyle, {backgroundColor}]}>
      <Image 
        source={{uri: url}}
        onLoad={loadFinish}
        style={buildStyle}
        resizeMode={'cover'}
      />
      <Animated.View style={[styles.placeholder, buildStyle, { opacity: opacityRef, backgroundColor }]}>
        {placeholder}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Avatar;
