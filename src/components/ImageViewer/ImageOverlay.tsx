import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';
import { snapPoint } from '../../utils/redash';
import { useOverlay } from '../Overlay';
import { Position } from './ImageContainer';
import Display from './Display';
import { Pagination, Percent } from '../Pagination';

const { width: Width, height: Height } = Dimensions.get('window');

interface ImageOverlayProps {
  positionList: Position[];
  duration?: number;
  paddingTop?: number;
  paddingBottom?: number;
  initialIndex: number;
  currentIndex: SharedValue<number>;
  data: any[];
  readonly innerKey?: string;

  onAppear?: () => void;
  onDisappear?: () => void;
}

interface ImageOverlayRef {}

const ImageOverlay = forwardRef<ImageOverlayRef, ImageOverlayProps>(
  (props, ref) => {
    const {
      positionList,
      duration = 300,
      paddingTop = 100,
      paddingBottom = 50,
      currentIndex,
      innerKey,
      onAppear,
      onDisappear,
      data,
      initialIndex,
    } = props;
    const { remove } = useOverlay();

    const snapPointsX = data.map((_, index) => -Width * index);
    const snapPointsY = [-0.25 * Height, 0, 0.25 * Height];

    const translateY = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const translateX = useSharedValue(-Width * initialIndex);
    const offsetX = useSharedValue(0);
    const opacity = useSharedValue(0);
    const willUnMount = useSharedValue(false);

    const paginationIndex = useDerivedValue(() => {
      return currentIndex.value + 1;
    });

    useEffect(() => {
      mount();
    }, []);

    const handleAppear = useCallback(() => {
      onAppear && onAppear();
    }, [onAppear]);

    const handleDisappear = useCallback(() => {
      onDisappear && onDisappear();
    }, [onDisappear]);

    const mount = useCallback(() => {
      opacity.value = withTiming(1, { duration }, () => {
        runOnJS(handleAppear)();
      });
    }, []);

    const unMount = useCallback(() => {
      opacity.value = withTiming(0, { duration }, () => {
        runOnJS(handleDisappear)();
      });
    }, []);

    const maskAnimationStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: '#000',
        opacity: opacity.value,
      };
    });

    const paginationStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    const panGestureX = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onBegin(() => {
        offsetX.value = translateX.value;
      })
      .onUpdate(({ translationX }) => {
        translateX.value = translationX + offsetX.value;
      })
      .onEnd(({ velocityX }) => {
        // TODO: ensure every sigle pan only move one screen width
        // const distance = (translateX.value + 0.2 * velocityX) / Width + scrollIndex.value;
        // const dest = interpolate(distance, [-0.5, 0, 0.5], [1, 0, -1], Extrapolation.CLAMP);
        // console.log(Math.round(dest));

        const destX = snapPoint(translateX.value, velocityX, snapPointsX);
        currentIndex.value = Math.abs(destX / Width);
        translateX.value = withTiming(destX, { duration });
      });

    const panGestureY = Gesture.Pan()
      .activeOffsetY([-10, 10])
      .onBegin(() => {
        offsetY.value = translateY.value;
      })
      .onUpdate(({ translationY }) => {
        translateY.value = translationY + offsetY.value;
        opacity.value = withTiming(
          interpolate(
            translateY.value,
            [-0.3 * Height, 0, 0.3 * Height],
            [0.5, 1, 0.5]
          ),
          { duration }
        );
      })
      .onEnd(({ velocityY }) => {
        const destY = snapPoint(translateY.value, velocityY, snapPointsY);

        if (Math.abs(destY) >= 0.25 * Height) {
          willUnMount.value = true;
          runOnJS(remove)(innerKey);
        }
        translateY.value = withTiming(0, { duration });
        opacity.value = withTiming(1, { duration });
      });

    const singleTap = Gesture.Tap()
      .maxDuration(250)
      .onStart(() => {})
      .onEnd(() => {
        willUnMount.value = true;
        runOnJS(remove)(innerKey);
      });

    const animationStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: translateX.value,
          },
        ],
      };
    });

    const handleClickMask = useCallback(() => {
      willUnMount.value = true;
      remove(innerKey);
    }, [remove, innerKey]);

    useImperativeHandle(
      ref,
      () => ({
        mount,
        unMount,
      }),
      []
    );

    return (
      <View style={styles.overlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.overlay]}
          onPress={handleClickMask}
        >
          <Animated.View style={[styles.overlay, maskAnimationStyle]} />
        </TouchableOpacity>
        <View style={[styles.container]} pointerEvents={'box-none'}>
          <GestureDetector
            gesture={Gesture.Exclusive(
              Gesture.Race(panGestureX, panGestureY),
              singleTap
            )}
          >
            <Animated.View
              style={[
                styles.displayContainer,
                {
                  top: paddingTop,
                  bottom: paddingBottom,
                  width: Width * data.length,
                },
                animationStyle,
              ]}
            >
              {data.map((item, index) => {
                const position = positionList[index];
                return (
                  <Display
                    key={`Content_${index}`}
                    containerTranslateY={translateY}
                    currentIndex={currentIndex}
                    {...{
                      position,
                      index,
                      paddingBottom,
                      paddingTop,
                      duration,
                      item,
                      willUnMount,
                    }}
                  />
                );
              })}
            </Animated.View>
          </GestureDetector>
        </View>
        <View
          style={[
            styles.paginationStyle,
            {
              top: paddingTop - 30,
            },
            paginationStyle,
          ]}
        >
          <Pagination
            currentIndex={paginationIndex}
            total={positionList.length}
          >
            <Percent style={styles.percent} />
          </Pagination>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
  },
  displayContainer: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
  },
  paginationStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  percent: {
    color: 'white',
  },
});

export default ImageOverlay;
