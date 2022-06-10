import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Dimensions, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { useOverlay } from '../Overlay';
import { Position } from './ImageContainer';

const {width: Width, height: Height} = Dimensions.get('window');

interface ImageOverlayProps {
  position: Position,
  duration?: number;
  paddingTop?: number;
  paddingBottom?: number;
  currentIndex: number;
  data: any[];
  readonly innerKey?: string;

  onAppear?: () => void;
  onDisappear?: () => void;
};

interface ImageOverlayRef {

}

const ImageOverlay = forwardRef<ImageOverlayRef, ImageOverlayProps>((props, ref) => {
  const { 
    position, 
    duration = 300, 
    paddingTop = 100, 
    paddingBottom = 50, 
    innerKey, 
    onAppear, 
    onDisappear,
    data,
    currentIndex,
  } = props;
  console.log(position);
  const {remove} = useOverlay();

  const snapPoints = data.map((_, index) => -Width * index);

  const translateY = useSharedValue(0);
  const translateX = useSharedValue(-Width * currentIndex);
  const offsetX = useSharedValue(0);
  const opacity = useSharedValue(0);

  console.log(currentIndex);


  useEffect(() => {
    mount();
  }, [])

  const mount = useCallback(() => {
    opacity.value = withTiming(0.3, {duration}, () => {
      onAppear && runOnJS(onAppear)();
    });
  }, [onAppear]);

  const unMount = useCallback(() => {
    opacity.value = withTiming(0, {duration}, () => {
      onDisappear && runOnJS(onDisappear)();
    });
  }, [onDisappear])

  const maskAnimationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: '#000',
      opacity: opacity.value
    }
  });

  const panGesture = Gesture.Pan()
  .onBegin(() => {
    offsetX.value = translateX.value;
  })
  .onUpdate(({translationX, translationY}) => {
    translateX.value = translationX + offsetX.value;
  })
  .onEnd(({velocityX, velocityY}) => {
    const dest = snapPoint(translateX.value, velocityX, snapPoints);
    translateX.value = withTiming(dest, {duration});
  })


  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      console.log('ajaha');
    });

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value
      }]
    }
  })

  const handleClickMask = useCallback(() => {
    console.log('remove');
    remove(innerKey);
  }, [remove, innerKey]);
  
  useImperativeHandle(ref, () => ({
    mount,
    unMount,
  }), []);
  
  return (
    <View style={styles.overlay}>
      <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={handleClickMask}>
        <Animated.View style={[styles.overlay, maskAnimationStyle]} />
      </TouchableOpacity>
      <View style={[styles.container]} pointerEvents={"box-none"}>
        <GestureDetector gesture={Gesture.Exclusive(panGesture, singleTap)}>
          <Animated.View style={[{
            position: 'absolute',
            top: paddingTop,
            left: 0,
            bottom: paddingBottom,
            flexDirection: "row",
            alignItems: "center",
            width: Width*data.length,
          }, animationStyle]}>
            {            
              data.map((item, index) => {
                return (<Content {...{position, currentIndex, index, paddingBottom, paddingTop, duration, item }} />)
              })
            }
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  )
});

interface ContentProps {
  position: Position,
  duration?: number,
  paddingTop: number;
  paddingBottom: number;
  item: any;
  currentIndex: number;
  index: number;
}

const Content: React.FC<ContentProps> = (props) => {
  const {position, duration, paddingTop, paddingBottom, item, currentIndex, index} = props;
  const { width: w, height: h, pageX: x, pageY: y } = position;

  const width = useSharedValue(w);
  const height = useSharedValue(h);
  const translateY = useSharedValue(y);
  const translateX = useSharedValue(x)

  const animationStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      transform: [{
        translateX: translateX.value
      }, {
        translateY: translateY.value
      }]
    }
  })

  useEffect(() => {
    if (currentIndex === index) {
      width.value = withTiming(Width, {duration});
      height.value = withTiming(Height - paddingTop - paddingBottom, {duration});
      translateX.value = withTiming(0, {duration});
      translateY.value = withTiming(0, {duration});  
    } else {
      width.value = Width;
      height.value = Height - paddingTop - paddingBottom;
      translateX.value = 0;
      translateY.value = 0;  
    }
  }, [])

  return (
    <View style={{ flex: 1, width: Width }}>
      <Animated.View style={[animationStyle]}>
        <Image source={item.source} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </Animated.View>  
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1, 
  }
})
export default ImageOverlay;
