import React, {Component, useState, useRef, useEffect} from 'react'
import {Text} from 'react-native'
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, useAnimatedRef, scrollTo, withTiming, useAnimatedReaction, withDecay, cancelAnimation, useDerivedValue } from 'react-native-reanimated';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    GestureType,
  } from 'react-native-gesture-handler';
  
const HEADE_HEIGHT = 180;

const HeadTabView: React.FC<null> = (props) => {
  const headerY = useSharedValue(0);
  const headerYOffset = useSharedValue(0);

  const animatedRef = useAnimatedRef();

  const integralY = useSharedValue(0);
  const integralYOffset = useSharedValue(0);

  const scrollValue = useSharedValue(0);

  const nativeRef = useRef();

  const totalRef = useRef();
  const headerRef = useRef();

  const isHeaderDecay = useSharedValue(false);

  const [childrenScrollY, setChildrenScrollY] = useState([]);

  const stopAnimation = () => {
      'worklet';
      cancelAnimation(headerY)
  }

  useEffect(() => {
      setChildrenScrollY((children) => {
          return {...children, [0]: scrollValue }
      })
  }, []);

  const panGesture = Gesture.Pan()
      .withRef(totalRef)
      .activeOffsetX([-500, 500])
      .activeOffsetY([-10, 10])
      .simultaneousWithExternalGesture(nativeRef, headerRef)
      .onBegin(() => {
          stopAnimation();
          integralYOffset.value = integralY.value;
          console.log('onBegin');
      })
      .onUpdate(({ translationY }) => {
          console.log('integralY', translationY);

          integralY.value = translationY + integralYOffset.value;
          // scrollTo(animatedRef, 0, -integralY.value, false);
      })
      .onEnd(() => {
          console.log('onEnd');
          // if (integralY.value > 0) {
          //     integralY.value = withTiming(0);
          // }
      });


  const scrollHandler = useAnimatedScrollHandler({
      onBeginDrag: () => {
      },
      onScroll: (event) => {
          scrollValue.value = event.contentOffset.y;
      },
      onMomentumEnd: () =>{
          console.log('onMomentumEnd', scrollValue.value);
      }
  });

  const headerStyleInter = useDerivedValue(() => {
      return interpolate(scrollValue.value, [0,HEADE_HEIGHT-100],[0, -HEADE_HEIGHT+100], Extrapolation.CLAMP);
  }, [scrollValue])

  const headerStyle = useAnimatedStyle(() => {
      return {
          transform: [{
              translateY: headerStyleInter.value
          }, {
              scale: 1
          }]
      }
  })

  const nativeGes = Gesture.Native().withRef(nativeRef);

  const containerStyle = useAnimatedStyle(() => {
      return {
          transform: [
              {
                  translateY: 0
              }
          ]
      }
  })

  const stopScrolling = () => {
      'worklet';
      scrollTo(animatedRef, 0, childrenScrollY[0].value + 0.1, false);
  }

  useAnimatedReaction(() => headerY.value, () => {
      'worklet';
      if (isHeaderDecay.value) {
          scrollTo(animatedRef, 0, headerY.value, false);
      }
  })

  const headerPan = Gesture.Pan()
      .activeOffsetY([-10, 10])
      .withRef(headerRef)
      .simultaneousWithExternalGesture(totalRef)
      .onBegin(() => {
          stopScrolling();
          headerYOffset.value = 0;
      })
      .onUpdate(({ translationY }) => {
          if (!isHeaderDecay.value) {
              headerYOffset.value = childrenScrollY[0].value;
              isHeaderDecay.value = true;    
          }
          headerY.value = -translationY + headerYOffset.value;
      })
      .onEnd(({ velocityY }) => {
          headerYOffset.value = 0;
          headerY.value = withDecay({velocity: -velocityY}, () => {
              isHeaderDecay.value = false;
          })    
      });

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
          <GestureDetector gesture={panGesture}>
              <Animated.View style={[{ flex: 1, backgroundColor: 'pink' }, containerStyle]}>
                  <GestureDetector gesture={nativeGes}>
                      <Animated.ScrollView
                          ref={animatedRef}
                          onScroll={scrollHandler} 
                          contentContainerStyle={{ paddingTop: HEADE_HEIGHT }} 
                          scrollEventThrottle={16} 
                          scrollIndicatorInsets={{ top: HEADE_HEIGHT - 44 }}
                          bounces={false}
                      >
                          {
                              new Array(80).fill(0).map((item, index) => {
                                  return <Text key={index} style={{ margin: 10, fontSize: 16 }}>{index}</Text>
                              })
                          }
                      </Animated.ScrollView>
                  </GestureDetector>
                  <GestureDetector gesture={headerPan}>
                      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, backgroundColor: 'orange', width: '100%', height: HEADE_HEIGHT }, headerStyle]}>
                          <Text>Header View</Text>
                      </Animated.View>
                  </GestureDetector>
              </Animated.View>
          </GestureDetector>
      </GestureHandlerRootView>
  )
}
export default HeadTabView;
