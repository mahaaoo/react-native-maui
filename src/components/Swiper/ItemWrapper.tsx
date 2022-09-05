import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { judgeRange } from './utils';
import { ItemWrapperProps } from './type';

const ItemWrapper: React.FC<ItemWrapperProps> = (props) => {
  const { currentIndex, index, children, size, options } = props;
  const [hidden, setHidden] = useState(true);

  useAnimatedReaction(
    () => currentIndex.value,
    () => {
      const isRange = judgeRange(index, size, currentIndex.value, options);
      runOnJS(setHidden)(!isRange);
    }
  );

  if (hidden) {
    // TODO: 需要返回空View，此处暂时简单返回一个空View站位
    // 返回空View需要重新计算排列方式
    // Freeze maybe useful
    return <View style={styles.emptyContainer} />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    height: '100%',
  },
});

export default ItemWrapper;
