import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {View} from 'react-native';
import Animated, { runOnJS, useAnimatedReaction } from 'react-native-reanimated';

interface PaginationRef {
  currentIndex: number;
  total: number;
}

export const PaginationContext = createContext({} as PaginationRef);
export const usePagination = () => useContext(PaginationContext);

interface PaginationProps {
  currentIndex: number | Animated.SharedValue<number>;
  total: number;
  position?: 'left' | 'center' | 'right';
};

const Pagination: React.FC<PaginationProps> = props => {
  const {currentIndex, total, position = 'center', children} = props;
  const [index, setIndex] = useState(() => {
    if (typeof currentIndex === 'number') {
      return currentIndex;
    }
    
    return currentIndex.value;
  });

  useEffect(() => {    
    if (typeof currentIndex === 'number') {      
      setIndex(currentIndex);
    }
  }, [currentIndex]);

  useAnimatedReaction(() => currentIndex, (currentIndex) => {
    if (typeof currentIndex !== 'number') {      
      runOnJS(setIndex)(currentIndex.value);
    }
  })

  const alignItemsType = useMemo(() => {
    if (position === 'left') return 'flex-start';
    if (position === 'center') return 'center';
    if (position === 'right') return 'flex-end';
    return 'center';
  }, [position]);

  return (
    <View style={{ alignItems: alignItemsType, marginHorizontal: 10 }}>
      <PaginationContext.Provider value={{
        currentIndex: index,
        total,
      }}>
        {children}
      </PaginationContext.Provider>
    </View>
  )
};

export default Pagination;
