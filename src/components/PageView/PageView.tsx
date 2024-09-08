import React, { forwardRef, useImperativeHandle } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { snapPoint, clamp } from '../../index';

interface PageViewProps {
  children: React.ReactElement;

  style?: ViewStyle;
  initialPage?: number;
  scrollEnabled?: boolean;
  bounces?: boolean;

  onPageScroll?: (translate: number) => void;
  onPageSelected?: (currentPage: number) => void;
  onPageScrollStateChanged?: (state: PageStateType) => void;
}

interface PageViewRef {
  setPage: (index: number) => void;
  setPageWithoutAnimation: (index: number) => void;
  getCurrentPage: () => number;
}

const { width, height } = Dimensions.get('window');
const DURATION = 350;

type PageStateType = 'dragging' | 'settling' | 'idle';

interface PageViewVerifyProps extends PageViewProps {
  pageSize: number;
  contentSize: number;
  snapPoints: number[];
}

const verifyProps = (props: PageViewProps): PageViewVerifyProps => {
  const { children, style } = props;
  const pageSize = React.Children.count(children);
  if (pageSize === 0) {
    throw new Error('PageView must be contains at least one chid');
  }
  let contentSize: number = width;
  if (style && style.width) {
    if (typeof style.width === 'number') {
      contentSize = style.width;
    } else {
      throw new Error('PageView width only support number');
    }
  }

  const snapPoints = new Array(pageSize)
    .fill(0)
    .map((_, index) => -index * contentSize);

  return {
    ...props,
    pageSize,
    contentSize,
    snapPoints,
  };
};

const PageView = forwardRef<PageViewRef, PageViewProps>((props, ref) => {
  const {
    children,
    style,
    contentSize,
    pageSize,
    snapPoints,
    onPageSelected,
    initialPage = 0,
    onPageScrollStateChanged,
    onPageScroll,
    scrollEnabled = true,
    bounces = true,
  } = verifyProps(props);

  const pageMove = useSharedValue(-initialPage * contentSize);
  const offset = useSharedValue(0);
  const currentPage = useSharedValue(initialPage);
  const pageState = useSharedValue<PageStateType>('idle');

  const pageSelected = (nextPage: number) => {
    onPageSelected && onPageSelected(nextPage);
  };

  const pageScrollStateChanged = (state: PageStateType) => {
    onPageScrollStateChanged && onPageScrollStateChanged(state);
  };

  const pageScroll = (translate: number) => {
    onPageScroll && onPageScroll(Math.abs(translate));
  };

  const setPage = (index: number) => {
    moveTo(index);
  };

  const setPageWithoutAnimation = (index: number) => {
    pageMove.value = -index * contentSize;
    currentPage.value = index;
    pageState.value = 'idle';
    runOnJS(pageSelected)(index);
  };

  const getCurrentPage = () => {
    return currentPage.value;
  };

  useImperativeHandle(
    ref,
    () => ({
      setPage,
      setPageWithoutAnimation,
      getCurrentPage,
    }),
    []
  );

  useAnimatedReaction(
    () => pageState.value,
    (value) => {
      runOnJS(pageScrollStateChanged)(value);
    }
  );

  useAnimatedReaction(
    () => pageMove.value,
    (value) => {
      runOnJS(pageScroll)(value);
    }
  );

  const moveTo = (page: number) => {
    'worklet';
    pageMove.value = withTiming(
      -page * contentSize,
      { duration: DURATION },
      () => {
        const nextPage = Math.abs(Math.round(pageMove.value / contentSize));
        currentPage.value = nextPage;
        pageState.value = 'idle';
        runOnJS(pageSelected)(nextPage);
      }
    );
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onTouchesDown((event, stateManager) => {
      if (scrollEnabled === false) {
        stateManager.fail();
      }
    })
    .onBegin(() => {
      offset.value = pageMove.value;
    })
    .onUpdate(({ translationX }) => {
      pageState.value = 'dragging';
      if (bounces) {
        pageMove.value = translationX + offset.value;
      } else {
        pageMove.value = clamp(
          translationX + offset.value,
          -(pageSize - 1) * contentSize,
          0
        );
      }
    })
    .onEnd(({ velocityX }) => {
      pageState.value = 'settling';
      const dest = snapPoint(pageMove.value, velocityX, snapPoints);
      // 每次移动只能切换一个page
      const willToPage = Math.abs(Math.round(dest / contentSize));
      const toValue = clamp(
        willToPage,
        currentPage.value - 1,
        currentPage.value + 1
      );

      moveTo(toValue);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: pageMove.value,
        },
      ],
    };
  });

  return (
    <View style={{ flex: 1, width: contentSize, overflow: 'hidden' }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            style,
            {
              flexDirection: 'row',
              width: contentSize * pageSize,
            },
            animatedStyle,
          ]}
        >
          {React.Children.map(children, (child) => {
            return (
              <PageContainer contentSize={contentSize}>{child}</PageContainer>
            );
          })}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

interface PageContainerProps {
  children: React.ReactElement;
  contentSize: number;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const { children, contentSize } = props;
  return <View style={{ width: contentSize }}>{children}</View>;
};

export default PageView;
