import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

interface TabViewContainerProps {
  index: number;
  currentIndex: Animated.SharedValue<number>;
  contentWidth: Animated.SharedValue<number>;
}

enum FreezeType {
  UNSHOW, // unload brefore
  SHOWING, // unfreez
  DIDSHOW, // freeze
}

const TabViewContainer: React.FC<TabViewContainerProps> = (props) => {
  const { index, currentIndex, children, contentWidth } = props;
  const [freeze, setFreeze] = useState<FreezeType>(FreezeType.UNSHOW);

  // TODO: 对于首次加载的TabView，只需要加载默认的intialPage页面即可，其余页面用空View填充，提升首次加载速度
  // 对于已经加载过的页面而言，使用freeze做keepalive
  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      if (index === value) {
        runOnJS(setFreeze)(FreezeType.SHOWING);
      }
    }
  );

  if (freeze === FreezeType.UNSHOW) {
    return <View style={{ width: contentWidth.value }} />;
  }

  return <View style={{ width: contentWidth.value }}>{children}</View>;
};

export default TabViewContainer;
