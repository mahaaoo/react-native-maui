import React, { useState } from 'react';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';
import { Dot, Pagination } from '../Pagination';

interface SwiperPaginationProps {
  currentIndex: Animated.SharedValue<number>;
  total: number;
};

const SwiperPagination: React.FC<SwiperPaginationProps> = props => {
  const {currentIndex, total} = props;
  const [index, setIndex] = useState<number>(currentIndex.value);

  useAnimatedReaction(() => currentIndex.value, (value) => {
    runOnJS(setIndex)(value);
  })

  return (
    <Pagination currentIndex={index} total={total}>
      <Dot />
    </Pagination>
  )
};

export default SwiperPagination;
