import React from 'react';
import {View, ViewStyle} from 'react-native';
import DotItem from './DotItem';
import {usePagination} from './Pagination';

interface DotProps {
  size?: number;
  activeColor?: string;
  inActiveColor?: string;
  shape?: 'circle' | 'cube';
  style?: ViewStyle;
  direction?: 'row' | 'column';
};

const Dot: React.FC<DotProps> = props => {
  const {size, activeColor, inActiveColor, shape, style, direction='row'} = props;
  const {total} = usePagination();

  return (
    <View style={{flexDirection: direction}}>
      {
        new Array(total).fill(0).map((_, index: number) => {
          return (
            <DotItem key={`Dot${index}`} {...{index, size, activeColor, inActiveColor, shape, style}} />
          )
        })
      }
    </View>
  )
};

export default Dot;
