import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from 'react';
import { Dimensions, Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { useOverlay } from '../Overlay';
import { Position } from './ImageContainer';

const {width: Width, height: Height} = Dimensions.get('window');

interface ImageOverlayProps {
  positionList: Position[],
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
    positionList, 
    duration = 300, 
    paddingTop = 100, 
    paddingBottom = 50, 
    innerKey, 
    onAppear, 
    onDisappear,
    data,
    currentIndex,
  } = props;
  const {remove} = useOverlay();

  const snapPointsX = data.map((_, index) => -Width * index);
  const snapPointsY = [-0.25 * Height, 0, 0.25 * Height];

  const translateY = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(-Width * currentIndex);
  const offsetX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scrollIndex = useSharedValue(currentIndex);
  const willUnMount = useSharedValue(false);

  useEffect(() => {
    mount();
  }, [])

  const mount = useCallback(() => {
    opacity.value = withTiming(1, {duration}, () => {
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

  const panGestureX = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onBegin(() => {
    offsetX.value = translateX.value;
  })
  .onUpdate(({translationX}) => {
    translateX.value = translationX + offsetX.value;
  })
  .onEnd(({velocityX}) => {
    const destX = snapPoint(translateX.value, velocityX, snapPointsX);
    scrollIndex.value = Math.abs(destX / Width);
    translateX.value = withTiming(destX, {duration});
})

  const panGestureY = Gesture.Pan()
  .activeOffsetY([-10, 10])
  .onBegin(() => {
    offsetY.value = translateY.value;
  })
  .onUpdate(({translationY}) => {
    translateY.value = translationY + offsetY.value;    
    opacity.value = withTiming(Math.abs(translateY.value) * 5 / Height, {duration});
  })
  .onEnd(({velocityY}) => {
    const destY = snapPoint(translateY.value, velocityY, snapPointsY);

    if (Math.abs(destY) >= 0.25 * Height) {
      willUnMount.value = true;
      runOnJS(remove)(innerKey);  
    } else {
      translateY.value = withTiming(0, {duration});
      opacity.value = withTiming(1, {duration});
    }
  })

  const singleTap = Gesture.Tap()
  .maxDuration(250)
  .onStart(() => {
  })
  .onEnd(() => {
    willUnMount.value = true;
    runOnJS(remove)(innerKey);
  })

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: translateX.value
      }]
    }
  })

  const handleClickMask = useCallback(() => {
    willUnMount.value = true;
    remove(innerKey);
  }, [remove, innerKey]);
  
  useImperativeHandle(ref, () => ({
    mount,
    unMount,
  }), []);

  return (
    <View style={styles.overlay}>
      <TouchableOpacity activeOpacity={1} style={[styles.overlay]} onPress={handleClickMask}>
        <Animated.View style={[styles.overlay, maskAnimationStyle]} />
      </TouchableOpacity>
      <View style={[styles.container]} pointerEvents={"box-none"}>
        <GestureDetector gesture={Gesture.Exclusive(panGestureX, panGestureY, singleTap)}>
          <Animated.View style={[{
            position: 'absolute',
            top: paddingTop,
            left: 0,
            bottom: paddingBottom,
            flexDirection: "row",
            width: Width*data.length,
          }, animationStyle]}>
            {            
              data.map((item, index) => {
                const position = positionList[index];
                return (
                        <Content 
                          key={`Content_${index}`}
                          containerTranslateY={translateY}
                          currentIndex={scrollIndex} 
                          {...{position, index, paddingBottom, paddingTop, duration, item, willUnMount }}
                        />
                      )
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
  currentIndex: Animated.SharedValue<number>;
  index: number;
  willUnMount: Animated.SharedValue<boolean>;
  containerTranslateY: Animated.SharedValue<number>;
}

const Content: React.FC<ContentProps> = (props) => {
  const {position, duration, paddingTop, paddingBottom, item, currentIndex, index, willUnMount, containerTranslateY} = props;
  const { width: w, height: h, pageX: x, pageY: y } = position;
  
  const width = useSharedValue(w);
  const height = useSharedValue(h);
  const translateX = useSharedValue(x)
  const translateY = useSharedValue(y - paddingTop);
  const scale = useSharedValue(1);

  useAnimatedReaction(() => willUnMount.value, (value) => {
    if (value && index === currentIndex.value) {
      console.log('即将关闭的', position);

      width.value = withTiming(w, {duration});
      height.value = withTiming(h, {duration});
      translateX.value = withTiming(x, {duration});
      translateY.value = withTiming(y - paddingTop, {duration});  
    }
  });

  useAnimatedReaction(() => containerTranslateY.value, (value) => {
    const ratio = interpolate(value, [-Height/2, 0, Height / 2], [0.5, 1, 0.5]);
    scale.value = withTiming(ratio, {duration});
  })

  const animationStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height: height.value,
      transform: [{
        translateX: translateX.value
      }, {
        translateY: translateY.value + containerTranslateY.value
      }, {
        scale: scale.value
      }]
    }
  })

  useEffect(() => {
    console.log('currentIndex.value', currentIndex.value)
    if (currentIndex.value === index) {
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
