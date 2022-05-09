import React from 'react';
import {View, Text} from 'react-native';
import Animated from 'react-native-reanimated';
import Dot from './Dot';

interface PaginationProps {
  currentIndex: Animated.SharedValue<number>;
  dataNumber: number;
};

const Pagination: React.FC<PaginationProps> = props => {
  const {currentIndex, dataNumber} = props;

  return (
    <View style={{ flex: 1,  flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {
        new Array(dataNumber).fill(0).map((_, index: number) => {
          return (
            <Dot key={`Dot${index}`} {...{currentIndex, index}} />
          )
        })
      }
    </View>
  )
};

export default Pagination;
