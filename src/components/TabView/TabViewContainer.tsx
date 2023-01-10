import React, { useState } from 'react';
import Animated, {
  useAnimatedReaction,
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTabView } from './type';

interface TabViewContainerProps {
  index: number;
}

enum FreezeType {
  UNSHOW, // unload brefore
  SHOWING, // unfreez
  DIDSHOW, // freeze
}

const TabViewContainer: React.FC<TabViewContainerProps> = (props) => {
  const { index, children } = props;
  const { currentIndex, contentWidth } = useTabView();
  const [freeze, setFreeze] = useState<FreezeType>(FreezeType.UNSHOW);

  // TODO: 对于首次加载的TabView，只需要加载默认的intialPage页面即可，其余页面用空View填充，提升首次加载速度
  // 对于已经加载过的页面而言，使用freeze做keepalive
  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      if (index === value && freeze !== FreezeType.SHOWING) {
        runOnJS(setFreeze)(FreezeType.SHOWING);
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: contentWidth.value,
    };
  });

  if (freeze === FreezeType.UNSHOW) {
    return <Animated.View style={animatedStyle} />;
  }

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default TabViewContainer;
