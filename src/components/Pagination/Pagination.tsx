import React, { createContext, useContext, useMemo } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

interface PaginationRef {
  currentIndex: number | Animated.SharedValue<number>;
  total: number;
}

export const PaginationContext = createContext({} as PaginationRef);
export const usePagination = () => useContext(PaginationContext);

interface PaginationProps {
  currentIndex: number | Animated.SharedValue<number>;
  total: number;
  position?: 'left' | 'center' | 'right';
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const { currentIndex, total, position = 'center', children } = props;

  const alignItemsType = useMemo(() => {
    if (position === 'left') return 'flex-start';
    if (position === 'center') return 'center';
    if (position === 'right') return 'flex-end';
    return 'center';
  }, [position]);

  return (
    <View style={{ alignItems: alignItemsType }}>
      <PaginationContext.Provider
        value={{
          currentIndex,
          total,
        }}
      >
        {children}
      </PaginationContext.Provider>
    </View>
  );
};

export default Pagination;
