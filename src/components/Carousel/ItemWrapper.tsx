import React, { useState } from 'react';
import { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { judgeRange } from './utils';
import { ItemWrapperProps, useCarousel } from './type';

const ItemWrapper: React.FC<ItemWrapperProps> = (props) => {
  const { index, children } = props;
  const { currentIndex, size, options } = useCarousel();
  const [hidden, setHidden] = useState(true);

  useAnimatedReaction(
    () => currentIndex.value,
    () => {
      const isRange = judgeRange(index, size, currentIndex.value, options);
      runOnJS(setHidden)(!isRange);
    }
  );

  if (hidden) {
    return null;
  }

  return <>{children}</>;
};

export default ItemWrapper;
